import express from 'express';
import { randomUUID } from 'crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  isInitializeRequest,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from '../config/config';
import { Logger } from '../utils/logger';
import { getErrorMessage } from '../utils/responseFormatter';
import { tools, handleToolCall } from '../tools';
import { prompts, getPromptByName } from '../prompts';
import { resources, readResourceByUri } from '../resources';

export class HttpServer {
  private app: express.Application;
  private port: number;
  private transports: Map<string, StreamableHTTPServerTransport> = new Map();

  constructor() {
    Logger.info('Initializing HttpServer...');
    this.app = express();
    this.port = config.port;

    this.setupMiddleware();
    this.setupRoutes();
    Logger.info('HttpServer initialized successfully.');
  }

  private createMcpServer(): Server {
    const mcpServer = new Server(
      {
        name: 'savingsrush-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
          resources: {},
        },
      }
    );

    mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
      Logger.debug('Handling ListToolsRequest');
      return {
        tools: tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      };
    });

    mcpServer.setRequestHandler(ListPromptsRequestSchema, async () => {
      Logger.debug('Handling ListPromptsRequest');
      return {
        prompts: prompts.map((prompt) => ({
          name: prompt.name,
          title: prompt.title,
          description: prompt.description,
          arguments: prompt.arguments,
        })),
      };
    });

    mcpServer.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      Logger.info(`Handling GetPromptRequest: ${name}`, args);
      return getPromptByName(name, args);
    });

    mcpServer.setRequestHandler(ListResourcesRequestSchema, async () => {
      Logger.debug('Handling ListResourcesRequest');
      return {
        resources: resources.map((resource) => ({
          uri: resource.uri,
          name: resource.name,
          title: resource.title,
          description: resource.description,
          mimeType: resource.mimeType,
        })),
      };
    });

    mcpServer.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      Logger.info(`Handling ReadResourceRequest: ${uri}`);
      return readResourceByUri(uri);
    });

    mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      Logger.info(`Handling CallToolRequest: ${name}`, args);

      try {
        const result = await handleToolCall(name, args);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          isError: !result.success,
        };
      } catch (error: unknown) {
        Logger.error(`Tool call error: ${name}`, error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: false, message: getErrorMessage(error) }),
            },
          ],
          isError: true,
        };
      }
    });

    return mcpServer;
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use((req, _res, next) => {
      Logger.info(`[HTTP] ${req.method} ${req.url}`);
      next();
    });
  }

  private async handleStreamableMcpRequest(req: express.Request, res: express.Response) {
    try {
      const sessionIdHeader = req.headers['mcp-session-id'];
      const sessionId = Array.isArray(sessionIdHeader) ? sessionIdHeader[0] : sessionIdHeader;
      let transport: StreamableHTTPServerTransport | undefined;

      if (sessionId) {
        const existingTransport = this.transports.get(sessionId);
        if (existingTransport) {
          transport = existingTransport;
        }
      } else if (req.method === 'POST' && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (initializedSessionId) => {
            this.transports.set(initializedSessionId, transport!);
            Logger.info(`[MCP] Streamable session initialized: ${initializedSessionId}`);
          },
        });

        transport.onclose = () => {
          const activeSessionId = transport?.sessionId;
          if (activeSessionId) {
            this.transports.delete(activeSessionId);
            Logger.info(`[MCP] Streamable session closed: ${activeSessionId}`);
          }
        };

        transport.onerror = (error) => {
          Logger.error('Streamable MCP transport error', error);
        };

        await this.createMcpServer().connect(transport);
      } else {
        res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: No valid MCP session or initialize request provided',
          },
          id: null,
        });
        return;
      }

      if (!transport) {
        throw new Error('Failed to initialize MCP transport');
      }

      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      Logger.error('Error handling streamable MCP request', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  }

  private setupRoutes() {
    this.app.all('/mcp', async (req, res) => {
      await this.handleStreamableMcpRequest(req, res);
    });

    this.app.get('/health', (_req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        active_sessions: this.transports.size,
      });
    });

    this.app.get('/', (_req, res) => {
      res.json({
        mcp_server: 'savingsrush-mcp',
        version: '1.0.0',
        endpoint: '/mcp',
        health_check: '/health',
      });
    });
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.app.listen(this.port, '0.0.0.0', () => {
          Logger.info(`SavingsRush MCP Server running on 0.0.0.0:${this.port}`);
          resolve();
        });
      } catch (error) {
        Logger.error('Failed to start listening', error);
        reject(error);
      }
    });
  }
}

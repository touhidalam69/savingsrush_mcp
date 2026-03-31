import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { prompts, getPromptByName } from '../prompts';
import { resources, readResourceByUri } from '../resources';
import { tools, handleToolCall } from '../tools';
import { Logger } from '../utils/logger';
import { getErrorMessage } from '../utils/responseFormatter';

export const createMcpServer = (): Server => {
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
};

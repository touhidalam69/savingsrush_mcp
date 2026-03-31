import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './mcp';
import { Logger } from '../utils/logger';

export class StdioServer {
  async start(): Promise<void> {
    Logger.info('Initializing StdioServer...');
    const transport = new StdioServerTransport();
    transport.onerror = (error) => {
      Logger.error('Stdio MCP transport error', error);
    };
    transport.onclose = () => {
      Logger.info('Stdio MCP transport closed');
    };

    const mcpServer = createMcpServer();
    await mcpServer.connect(transport);
    Logger.info('SavingsRush MCP Server running on stdio');
  }
}

import { executeTool } from '../utils';
import { ApiClient } from '../../services/apiClient';

const api = ApiClient.getInstance();

// Tool Definitions
export const listWebsitesToolDef = {
  name: 'list_websites',
  description: 'List active websites on SavingsRush',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const listTopWebsitesToolDef = {
  name: 'list_top_websites',
  description: 'List top websites on SavingsRush',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

// Handlers
export const handleListWebsites = async () => {
  return executeTool({
    name: 'list_websites',
    cacheKey: 'websites:active',
    apiCall: async () => api.get<any[]>('/getActiveWebsites'),
    transform: (websites) => ({
      websites,
    }),
  });
};

export const handleListTopWebsites = async () => {
  return executeTool({
    name: 'list_top_websites',
    cacheKey: 'websites:top',
    apiCall: async () => api.get<any[]>('/getTopWebsite'), // API name is singular in prompt
    transform: (websites) => ({
      websites,
    }),
  });
};

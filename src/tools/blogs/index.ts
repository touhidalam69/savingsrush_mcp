import { executeTool } from '../utils';
import { ApiClient } from '../../services/apiClient';

const api = ApiClient.getInstance();

// Tool Definitions
export const listBlogsToolDef = {
  name: 'list_blogs',
  description: 'List published blogs on SavingsRush',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

// Handlers
export const handleListBlogs = async () => {
  return executeTool({
    name: 'list_blogs',
    cacheKey: 'blogs:published',
    apiCall: async () => api.get<any[]>('/getPublishedBlogs'),
    transform: (blogs) => ({
      blogs,
    }),
  });
};

import { z } from 'zod';
import { executeTool } from '../utils';
import { ApiClient } from '../../services/apiClient';
import { normalizeSlug } from '../../services/normalizer';

const api = ApiClient.getInstance();

// Tool Definitions
export const listActiveUsersToolDef = {
  name: 'list_active_users',
  description: 'List active verified users on SavingsRush',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const getUserToolDef = {
  name: 'get_user',
  description: 'Get user details by slug',
  inputSchema: {
    type: 'object',
    properties: {
      slug: { type: 'string', description: 'User slug (e.g. "john-doe")' },
    },
    required: ['slug'],
  },
};

// Handlers
export const handleListActiveUsers = async () => {
  return executeTool({
    name: 'list_active_users',
    cacheKey: 'users:active',
    apiCall: async () => api.get<any[]>('/getActiveVerifiedUsers'),
    transform: (users) => ({
      users,
      total: users.length,
    }),
  });
};

export const handleGetUser = async (args: any) => {
  if (!args || typeof args !== 'object') {
    throw new Error('Invalid arguments');
  }
  const slug = normalizeSlug(args.slug);
  if (!slug) throw new Error('Slug is required');

  return executeTool({
    name: 'get_user',
    cacheKey: `user:${slug}`,
    apiCall: async () => api.get<any>(`/getUserBySlug`, { slug }),
    transform: (user) => user,
  });
};

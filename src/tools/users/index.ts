import { executeTool } from '../utils';
import { ApiClient } from '../../services/apiClient';
import { normalizeSlug } from '../../services/normalizer';

const api = ApiClient.getInstance();

// Tool Definitions
export const listActiveUsersToolDef = {
  name: 'list_active_coupon_expert',
  description: 'List active verified coupon expert on SavingsRush',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const getUserToolDef = {
  name: 'get_coupon_expert',
  description: 'Get coupon expert details by slug',
  inputSchema: {
    type: 'object',
    properties: {
      slug: { type: 'string', description: 'coupon expert slug (e.g. "john-doe")' },
    },
    required: ['slug'],
  },
};

// Handlers
export const handleListActiveUsers = async () => {
  return executeTool({
    name: 'list_active_coupon_expert',
    cacheKey: 'coupon_expert:active',
    apiCall: async () => api.get<ActiveUsersResponse>('/getActiveVerifiedUsers'),
    transform: (response) => {
      const users = response?.data?.users || [];
      const cleanedUsers = users.map((user) => ({
        name: user.full_name,
        slug: user.slug,
        profile_url: `https://savingsrush.com/coupon-expert/${user.slug}/`,
        avatar: user.userimageurl || null,
        designation: user.designation || null,
        bio: user.meta_description || null,
        email: user.email,
      }));

      return {
        coupon_expert: cleanedUsers,
        total: cleanedUsers.length,
      };
    },
  });
};

export const handleGetUser = async (args?: Record<string, unknown>) => {
  if (!args || typeof args !== 'object') {
    throw new Error('Invalid arguments');
  }
  const slug = normalizeSlug(typeof args.slug === 'string' ? args.slug : '');
  if (!slug) throw new Error('Slug is required');

  return executeTool({
    name: 'get_coupon_expert',
    cacheKey: `coupon_expert:${slug}`,
    apiCall: async () => api.get<CouponExpertResponse>('/getUserBySlug', { slug }),
    transform: (user) => user,
  });
};

type User = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  is_verified: boolean;
  status: string;
  userrole: string;
  userimageurl: string;
  slug: string;
  updated_at: string;
  designation: string;
  meta_description: string;
};

type ActiveUsersResponse = {
  message: string;
  data: {
    users: User[];
  };
};

type CouponExpertResponse = Record<string, unknown>;

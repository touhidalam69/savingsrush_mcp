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
    apiCall: async () => api.get<WebsitesResponse>('/getActiveWebsites'),
    transform: (response) => {
      const websites = response?.data?.websites || [];
      const cleanedWebsites = websites.map((website) => ({
        url: website.url,
        category: website.category,
        name: website.name,
        savingsrush_url: `https://savingsrush.com/coupon-codes/${website.url}/`,
      }));

      return {
        websites: cleanedWebsites,
        total: cleanedWebsites.length,
      };
    },
  });
};

export const handleListTopWebsites = async () => {
  return executeTool({
    name: 'list_top_websites',
    cacheKey: 'websites:top',
    apiCall: async () => api.get<WebsitesResponse>('/getTopWebsite'),
    transform: (response) => {
      const websites = response?.data?.websites || [];
      const cleanedWebsites = websites.map((website) => ({
        url: website.url,
        category: website.category,
        name: website.name,
        coupon_code: website.coupon_code,
        description: website.description,
        used_count: website.used_count,
        savingsrush_url: `https://savingsrush.com/coupon-codes/${website.url}/`,
      }));

      return {
        websites: cleanedWebsites,
        total: cleanedWebsites.length,
      };
    },
  });
};

type Website = {
  url: string;
  category: string;
  name: string;
  coupon_code: string;
  description: string;
  used_count: number;
};

type WebsitesResponse = {
  message: string;
  data: {
    websites: Website[];
  };
};

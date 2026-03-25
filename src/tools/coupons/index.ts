import { executeTool } from '../utils';
import { ApiClient } from '../../services/apiClient';
import { normalizeUrl } from '../../services/normalizer';
import { handleListWebsites } from '../websites';

const api = ApiClient.getInstance();

// Tool Definitions
export const getCouponsToolDef = {
  name: 'get_coupons',
  description: 'Get coupons for a specific website URL',
  inputSchema: {
    type: 'object',
    properties: {
      url: { type: 'string', description: 'Website URL (e.g. "fabrilife.com")' },
    },
    required: ['url'],
  },
};

export const findCouponsToolDef = {
  name: 'find_coupons_by_site_name',
  description: 'Find coupons by fuzzy matching a site name (e.g. "fabrilife" -> "fabrilife.com")',
  inputSchema: {
    type: 'object',
    properties: {
      site_name: { type: 'string', description: 'Name of the website' },
    },
    required: ['site_name'],
  },
};

// Handlers
export const handleGetCoupons = async (args: any) => {
  const url = normalizeUrl(args.url);
  if (!url) throw new Error('URL is required');

  return executeTool({
    name: 'get_coupons',
    cacheKey: `coupons:${url}`,
    apiCall: async () => api.get<any[]>(`/getCouponsByWebsiteUrl`, { url }),
    transform: (coupons) => ({
      url,
      coupons,
      total: coupons.length,
    }),
  });
};

export const handleFindCoupons = async (args: any) => {
  const siteName = args.site_name;
  if (!siteName) throw new Error('Site name is required');

  return executeTool({
    name: 'find_coupons_by_site_name',
    cacheKey: `find:${siteName.toLowerCase().trim()}`,
    apiCall: async () => {
      // 1. Fetch websites (using the cached handler)
      const websitesResult = await handleListWebsites();
      
      if (!websitesResult.success) {
        throw new Error('Failed to fetch websites list for lookup');
      }

      // Type guard/cast to access success properties
      const successResult = websitesResult as { success: true; data: any; cached: boolean };
      const websites: any[] = successResult.data.websites;
      const normalizedQuery = siteName.toLowerCase().trim();

      // 2. Fuzzy match / Best match
      let bestMatch: any = null;

      // Simple heuristic: find first exact match
      bestMatch = websites.find((w: any) => {
        const wName = (w.name || '').toLowerCase();
        const wUrl = (w.websiteUrl || w.url || '').toLowerCase();
        return wName === normalizedQuery || wUrl === normalizedQuery;
      });

      if (!bestMatch) {
        // Try partial match
        bestMatch = websites.find((w: any) => {
          const wName = (w.name || '').toLowerCase();
          const wUrl = (w.websiteUrl || w.url || '').toLowerCase();
          return wName.includes(normalizedQuery) || wUrl.includes(normalizedQuery);
        });
      }

      if (!bestMatch) {
         throw new Error(`No website found matching "${siteName}". Please try a different name.`);
      }

      // 3. Resolve URL
      const matchedUrl = bestMatch.websiteUrl || bestMatch.url;
      if (!matchedUrl) {
        throw new Error(`Found website "${bestMatch.name}" but it has no URL.`);
      }

      // 4. Call handleGetCoupons logic directly (to avoid double wrapping in executeTool if desired, 
      // but calling it is fine because executeTool handles nested cache hits gracefully)
      const couponsResult = await handleGetCoupons({ url: matchedUrl });
      if (!couponsResult.success) {
        const errorResult = couponsResult as { success: false; message: string };
        throw new Error(`Failed to fetch coupons for matched site: ${errorResult.message}`);
      }
      
      return (couponsResult as { success: true; data: any }).data;
    },
    transform: (data) => data, // Coupons already transformed by handleGetCoupons
  });
};

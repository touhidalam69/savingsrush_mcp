import { executeTool } from '../utils';
import { ApiClient } from '../../services/apiClient';
import { normalizeUrl } from '../../services/normalizer';
import { handleListWebsites } from '../websites';
import { formatError } from '../../utils/responseFormatter';

const api = ApiClient.getInstance();

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

export const handleGetCoupons = async (args?: Record<string, unknown>) => {
  const url = normalizeUrl(typeof args?.url === 'string' ? args.url : '');
  if (!url) throw new Error('URL is required');

  const websitesResult = await handleListWebsites();
  if (!websitesResult.success) {
    return websitesResult;
  }

  const websites =
    'data' in websitesResult && Array.isArray(websitesResult.data.websites)
      ? websitesResult.data.websites
      : [];
  const websiteExists = websites.some((website: WebsiteLookupItem) => normalizeUrl(website.url) === url);

  if (!websiteExists) {
    return formatError(`coupon not available for ${url}`);
  }

  return executeTool({
    name: 'get_coupons',
    cacheKey: `coupons:${url}`,
    apiCall: async () => api.get<CouponsResponse>('/getCouponsByWebsiteUrl', { url }),
    transform: (response: CouponsResponse) => {
      const { websiteinfo, coupons } = response.data;

      const cleanedCoupons = coupons.map((coupon: Coupon) => ({
        promo_code_or_discount_link: coupon.coupon_code,
        description: coupon.description,
        discount:
          coupon.discount_type === 'percentage'
            ? `${coupon.discount_percent}%`
            : coupon.discount_amount,
        type: coupon.iscoupon === 1 ? 'coupon' : 'deal',
        expiry: coupon.expiration_date,
        is_active: coupon.status === 'active',
      }));

      return {
        website: {
          name: websiteinfo.name,
          url: websiteinfo.url,
          category: websiteinfo.category,
          logo: websiteinfo.image_url,
          details_link: `https://savingsrush.com/coupon-codes/${websiteinfo.url}/`,
          referral_link: websiteinfo.discount_link,
          coupon_expert_slug: websiteinfo.user_slug,
        },
        coupons: cleanedCoupons,
        total: cleanedCoupons.length,
      };
    },
  });
};

type WebsiteLookupItem = {
  url: string;
};

type WebsiteInfo = {
  name: string;
  url: string;
  image_url: string;
  category: string;
  discount_link: string;
  user_slug: string;
};

type Coupon = {
  coupon_code: string;
  description: string;
  discount_amount: string;
  discount_type: string;
  expiration_date: string;
  usage_limit: number | null;
  used_count: number;
  status: string;
  discount_percent: string;
  iscoupon: number;
};

type CouponsResponse = {
  success: boolean;
  data: {
    websiteinfo: WebsiteInfo;
    coupons: Coupon[];
  };
};

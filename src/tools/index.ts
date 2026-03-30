import { listActiveUsersToolDef, getUserToolDef, handleListActiveUsers, handleGetUser } from './users';
import { listWebsitesToolDef, listTopWebsitesToolDef, handleListWebsites, handleListTopWebsites } from './websites';
import { getCouponsToolDef, handleGetCoupons } from './coupons';
import { listBlogsToolDef, handleListBlogs } from './blogs';

export const tools = [
  listActiveUsersToolDef,
  getUserToolDef,
  listWebsitesToolDef,
  listTopWebsitesToolDef,
  getCouponsToolDef,
  listBlogsToolDef,
];

export const handleToolCall = async (name: string, args?: Record<string, unknown>) => {
  switch (name) {
    case 'list_active_coupon_expert':
      return handleListActiveUsers();
    case 'get_coupon_expert':
      return handleGetUser(args);
    case 'list_websites':
      return handleListWebsites();
    case 'list_top_websites':
      return handleListTopWebsites();
    case 'get_coupons':
      return handleGetCoupons(args);
    case 'list_blogs':
      return handleListBlogs();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
};

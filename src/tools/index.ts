import { listActiveUsersToolDef, getUserToolDef, handleListActiveUsers, handleGetUser } from './users';
import { listWebsitesToolDef, listTopWebsitesToolDef, handleListWebsites, handleListTopWebsites } from './websites';
import { getCouponsToolDef, findCouponsToolDef, handleGetCoupons, handleFindCoupons } from './coupons';
import { listBlogsToolDef, handleListBlogs } from './blogs';

export const tools = [
  listActiveUsersToolDef,
  getUserToolDef,
  listWebsitesToolDef,
  listTopWebsitesToolDef,
  getCouponsToolDef,
  findCouponsToolDef,
  listBlogsToolDef,
];

export const handleToolCall = async (name: string, args: any) => {
  switch (name) {
    case 'list_active_users':
      return handleListActiveUsers();
    case 'get_user':
      return handleGetUser(args);
    case 'list_websites':
      return handleListWebsites();
    case 'list_top_websites':
      return handleListTopWebsites();
    case 'get_coupons':
      return handleGetCoupons(args);
    case 'find_coupons_by_site_name':
      return handleFindCoupons(args);
    case 'list_blogs':
      return handleListBlogs();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
};

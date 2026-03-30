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
    apiCall: async () => api.get<BlogsResponse>('/getPublishedBlogs'),
    transform: (response: BlogsResponse) => {
      const blogs = response.data.blogs;

      const cleanedBlogs = blogs.map((blog: Blog) => ({
        title: blog.title,
        slug: blog.slug,
        url: `https://savingsrush.com/blog/${blog.slug}/`,
        summary: blog.excerpt,
        last_updated: blog.updated_at,
      }));

      return {
        blogs: cleanedBlogs,
        total: cleanedBlogs.length,
      };
    },
  });
};

type Blog = {
  title: string;
  slug: string;
  excerpt: string;
  updated_at: string;
};

type BlogsResponse = {
  message: string;
  data: {
    blogs: Blog[];
  };
};

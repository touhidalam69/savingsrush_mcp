export const normalizeSlug = (slug: string): string => {
  if (!slug) return '';
  return slug.trim().toLowerCase();
};

export const normalizeUrl = (url: string): string => {
  if (!url) return '';
  let normalized = url.toLowerCase().trim();
  
  // Remove protocol
  normalized = normalized.replace(/^https?:\/\//, '');
  
  // Remove trailing slash
  if (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  
  // Remove www. (optional, but often good for normalization, though not explicitly requested)
  // The prompt only said: remove protocol, remove trailing slash, lowercase. I will stick to that.
  
  return normalized;
};

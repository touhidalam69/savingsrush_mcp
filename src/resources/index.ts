export const resources = [
  {
    uri: 'savingsrush://server/about',
    name: 'server-about',
    title: 'SavingsRush MCP Server Overview',
    description: 'Overview of the SavingsRush MCP server, its purpose, and its supported MCP capabilities.',
    mimeType: 'text/plain',
  },
  {
    uri: 'savingsrush://tools/catalog',
    name: 'tools-catalog',
    title: 'SavingsRush Tool Catalog',
    description: 'Catalog of available SavingsRush MCP tools with usage guidance.',
    mimeType: 'text/plain',
  },
  {
    uri: 'savingsrush://examples/sample-queries',
    name: 'sample-queries',
    title: 'SavingsRush Sample Queries',
    description: 'Example user requests and the corresponding SavingsRush MCP tools to use.',
    mimeType: 'text/plain',
  },
];

const resourceContents: Record<string, string> = {
  'savingsrush://server/about': [
    'SavingsRush MCP Server',
    '',
    'This server exposes SavingsRush public API data over MCP using Streamable HTTP.',
    '',
    'Supported MCP features:',
    '- Tools',
    '- Prompts',
    '- Resources',
    '',
    'Primary data domains:',
    '- Coupon experts',
    '- Websites',
    '- Coupons and deals',
    '- Blogs',
    '',
    'Main MCP endpoint:',
    '- /mcp',
    '',
    'Health endpoint:',
    '- /health',
  ].join('\n'),
  'savingsrush://tools/catalog': [
    'SavingsRush MCP Tool Catalog',
    '',
    '1. list_active_coupon_expert',
    'Lists active verified coupon experts on SavingsRush.',
    '',
    '2. get_coupon_expert',
    'Arguments: slug',
    'Returns coupon expert details by slug.',
    '',
    '3. list_websites',
    'Lists active websites available in SavingsRush.',
    '',
    '4. list_top_websites',
    'Lists top websites available in SavingsRush.',
    '',
    '5. get_coupons',
    'Arguments: url',
    'Returns coupons and deals for a specific website URL.',
    '',
    '6. list_blogs',
    'Lists published blogs from SavingsRush.',
  ].join('\n'),
  'savingsrush://examples/sample-queries': [
    'SavingsRush MCP Sample Queries',
    '',
    'Example: Find the best coupon codes for fabrilife.com',
    'Suggested tool flow: get_coupons(url="fabrilife.com")',
    '',
    'Example: Show me the top stores on SavingsRush',
    'Suggested tool flow: list_top_websites()',
    '',
    'Example: Find an active coupon expert I can feature',
    'Suggested tool flow: list_active_coupon_expert()',
    '',
    'Example: Show the profile for coupon expert john-doe',
    'Suggested tool flow: get_coupon_expert(slug="john-doe")',
    '',
    'Example: Summarize recent published content from SavingsRush',
    'Suggested tool flow: list_blogs()',
  ].join('\n'),
};

export const readResourceByUri = async (uri: string) => {
  const content = resourceContents[uri];

  if (!content) {
    throw new Error(`Unknown resource: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'text/plain',
        text: content,
      },
    ],
  };
};

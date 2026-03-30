export const prompts = [
  {
    name: 'find_best_coupons_for_store',
    title: 'Find Best Coupons For Store',
    description: 'Guide the client to fetch and present the best available coupons for a store URL.',
    arguments: [
      {
        name: 'url',
        description: 'Store website URL such as "fabrilife.com".',
        required: true,
      },
      {
        name: 'goal',
        description: 'Optional savings goal such as "highest discount" or "working coupon code".',
        required: false,
      },
    ],
  },
  {
    name: 'recommend_top_stores',
    title: 'Recommend Top Stores',
    description: 'Guide the client to review top SavingsRush stores and recommend the most relevant ones.',
    arguments: [
      {
        name: 'audience',
        description: 'Optional audience or shopping intent such as "fashion shoppers" or "students".',
        required: false,
      },
    ],
  },
  {
    name: 'show_coupon_expert_profile',
    title: 'Show Coupon Expert Profile',
    description: 'Guide the client to fetch and present a coupon expert profile by slug.',
    arguments: [
      {
        name: 'slug',
        description: 'Coupon expert slug such as "john-doe".',
        required: true,
      },
    ],
  },
];

const getStringArg = (args: Record<string, unknown> | undefined, key: string) => {
  const value = args?.[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const getPromptByName = async (name: string, args?: Record<string, unknown>) => {
  switch (name) {
    case 'find_best_coupons_for_store': {
      const url = getStringArg(args, 'url');
      const goal = getStringArg(args, 'goal');

      if (!url) {
        throw new Error('Prompt argument "url" is required');
      }

      const goalLine = goal
        ? `Focus on this user goal: ${goal}.`
        : 'Focus on the strongest currently active savings opportunities.';

      return {
        description: 'Use SavingsRush coupon data to identify the best savings opportunities for a store.',
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: [
                `Find the best available coupons and deals for the store "${url}" using the SavingsRush MCP server.`,
                'Call the `get_coupons` tool with the provided URL.',
                goalLine,
                'Then summarize the top coupon codes or deals, mention expiry when available, and clearly separate coupon codes from deal links.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'recommend_top_stores': {
      const audience = getStringArg(args, 'audience');
      const audienceLine = audience
        ? `Tailor the recommendations for this audience or intent: ${audience}.`
        : 'Choose the most broadly useful and interesting stores from the top store list.';

      return {
        description: 'Review top SavingsRush stores and recommend the most relevant ones.',
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: [
                'Review the top stores available in the SavingsRush MCP server.',
                'Call the `list_top_websites` tool first.',
                audienceLine,
                'Recommend a short ranked list of stores and explain each recommendation in one sentence based on the available store information.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    case 'show_coupon_expert_profile': {
      const slug = getStringArg(args, 'slug');

      if (!slug) {
        throw new Error('Prompt argument "slug" is required');
      }

      return {
        description: 'Fetch and present a SavingsRush coupon expert profile.',
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: [
                `Look up the SavingsRush coupon expert with slug "${slug}".`,
                'Call the `get_coupon_expert` tool with that slug.',
                'Present a concise profile summary including name, designation, bio, profile URL, and any other useful public details returned by the tool.',
              ].join('\n'),
            },
          },
        ],
      };
    }
    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
};

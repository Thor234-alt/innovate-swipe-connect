
export const seedIdeas = [
  {
    id: "seed-1",
    title: "AI-Powered Personal Finance Coach",
    content: "An app that analyzes your spending patterns and provides personalized budgeting advice. Uses machine learning to predict future expenses and suggests optimal saving strategies. Could integrate with bank APIs for real-time transaction analysis.",
    user_id: "dummy-user-1",
    tags: ["fintech", "ai", "mobile app"],
    idea_type: "mobile app",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: { views: 45, likes: 12, shares: 3 }
  },
  {
    id: "seed-2", 
    title: "Virtual Reality Fitness Studio",
    content: "A VR platform where users can join immersive workout classes from home. Think Peloton but in virtual reality - boxing classes on a beach, yoga in mountain settings, or dance parties in futuristic clubs. Social features let friends work out together remotely.",
    user_id: "dummy-user-1",
    tags: ["vr", "fitness", "social"],
    idea_type: "platform",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: { views: 78, likes: 23, shares: 8 }
  },
  {
    id: "seed-3",
    title: "Local Skills Exchange Network",
    content: "A neighborhood-based app where people can trade skills instead of money. Teach someone guitar lessons in exchange for home repairs, or trade coding help for cooking classes. Built-in reputation system and scheduling tools.",
    user_id: "dummy-user-1", 
    tags: ["community", "sharing economy", "local"],
    idea_type: "social platform",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: { views: 34, likes: 9, shares: 2 }
  },
  {
    id: "seed-4",
    title: "Smart Plant Care Assistant",
    content: "IoT sensors + mobile app that monitors your houseplants' health. Tracks soil moisture, light levels, and temperature. Sends notifications when plants need water or care, and provides personalized growing tips based on plant species and local climate.",
    user_id: "dummy-user-1",
    tags: ["iot", "gardening", "smart home"],
    idea_type: "hardware + software",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    analytics: { views: 22, likes: 7, shares: 1 }
  },
  {
    id: "seed-5",
    title: "Micro-Learning Language Exchange",
    content: "5-minute daily language exchange sessions via video chat. Algorithm matches users based on native/target languages and schedules. Gamified progression system with conversation prompts and cultural exchange elements.",
    user_id: "dummy-user-1",
    tags: ["education", "language learning", "video chat"],
    idea_type: "edtech platform",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    analytics: { views: 15, likes: 4, shares: 0 }
  }
];

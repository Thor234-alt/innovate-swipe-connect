
export type Idea = {
  id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  stage: "Concept" | "MVP" | "Testing" | "Scaling";
  image?: string; // optional, for future use
};

export const demoIdeas: Idea[] = [
  {
    id: "1",
    title: "AI-Powered Marketplace",
    description: "A platform using AI to match freelancers with projects perfectly suited to their skills.",
    author: "Sam Innovator",
    tags: ["Technology", "Business"],
    stage: "Concept",
  },
  {
    id: "2",
    title: "Eco-Delivery Network",
    description: "A green logistics app optimizing routes for carbon-neutral deliveries.",
    author: "Jane Chang",
    tags: ["Sustainability", "Logistics"],
    stage: "MVP",
  },
  {
    id: "3",
    title: "Augmented Study Buddy",
    description: "An AR app to help students visualize and collaborate on course material in real time.",
    author: "Leah Kapoor",
    tags: ["Education", "AR"],
    stage: "Testing",
  },
  {
    id: "4",
    title: "NeighborGoods Sharing",
    description: "Connect with neighbors to lend/borrow rarely used tools and appliances.",
    author: "Carlos Romero",
    tags: ["Community", "Sharing Economy"],
    stage: "Scaling",
  },
];

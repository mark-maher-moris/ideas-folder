export type ProjectPhase = 
  | "Just Idea"
  | "Team Formation"
  | "Product Development"
  | "Go-To-Market"
  | "Scaling & Operations"
  | "Profit & Growth"
  | "Closed & Archived"
  | "Unicorn";

export interface TeamMember {
  name: string;
  email: string;
  imageUrl?: string;
  contactLink?: string;
  role?: string;
  shares: number
}

export interface Project {
  id: string;
  name: string;
  description: string;
  joinLink: string;
  coverImage: string;
  images: string[];
  tags: string[];
  requiredTalents: string[];
  phase: ProjectPhase;
  team: TeamMember[];
  comments: Comment[];
  suggestedIdeas: SuggestedIdea[];
  createdAt: Date;
  updatedAt: Date;
  encrypted:boolean;
  investors:TeamMember[];
  profit: number;
  loss: number;
  financialHistory: FinancialRecord[];
}

export interface ProjectSuggestion {
  id: string;
  projectSuggestedName: string;
  ideaDescription: string;
  suggesterName: string;
  whatsappPhoneNumber?: string;
  wantToWork: boolean;
  isPublic: boolean;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SuggestedIdea {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialRecord {
  id: string;
  date: Date;
  amount: number;
  isProfit: boolean;
  description: string;
}
export interface Project {
  id: string;
  name: string;
  description: string;
  joinLink: string;
  coverImage: string;
  images: string[];
  tags: string[];
  requiredTalents: string[];
  createdAt: Date;
  updatedAt: Date;
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
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  role?: string;
  createdAt: Date;
}
export interface ContentMeta {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  category?: string;
  slug: string;
  path: string;
}

export interface KnowledgeBaseItem extends ContentMeta {
  category: string;
}

export interface BlogPost extends ContentMeta {
  excerpt?: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  type: "education" | "work" | "project";
}

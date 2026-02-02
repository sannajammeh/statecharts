export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
}

export interface Post extends PostMeta {
  content: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string | null;
  // Assumed fields based on standard posts, adjust as needed
  authorName?: string;
  authorId?: string;
}

export interface GetPostsQueryParams {
  page?: number;
  pageSize?: number;
  isPublic?: boolean;
}

export interface CreatePostPayload {
  Title: string;
  Content: string;
  IsPublic: boolean;
  Image?: File; 
}

export interface UpdatePostPayload {
  title: string;
  content: string;
  isPublic: boolean;
}

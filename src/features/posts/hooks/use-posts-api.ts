import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost, 
  togglePostVisibility, 
  updatePostImage 
} from '../api/posts-api';
import { GetPostsQueryParams } from '../lib/types/posts-types';
import { unwrap } from '@/shared/lib/utils/api-utils';

export const useGetPostsInfiniteQuery = (params: Omit<GetPostsQueryParams, 'page'> = {}) => {
  return useInfiniteQuery({
    queryKey: ['posts', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => unwrap(getPosts({ ...params, page: pageParam })),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNextPage) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useGetPostsQuery = (params: GetPostsQueryParams) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => unwrap(getPosts(params)),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useGetPostByIdQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => unwrap(getPostById(id!)),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => unwrap(createPost(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => unwrap(updatePost(id, data)),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', variables.id] });
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unwrap(deletePost(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useTogglePostVisibilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unwrap(togglePostVisibility(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePostImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, image }: { id: string; image: File }) => unwrap(updatePostImage(id, image)),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', variables.id] });
    },
  });
};

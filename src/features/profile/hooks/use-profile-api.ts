import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProfile, 
  updateProfile, 
  updateProfileImage, 
  deleteProfileImage 
} from '../api/profile-api';
import { UpdateProfileRequest } from '../lib/types/profile-types';
import { unwrap } from '@/shared/lib/utils/api-utils';

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => unwrap(getProfile()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => unwrap(updateProfile(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUpdateProfileImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (image: File) => unwrap(updateProfileImage(image)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useDeleteProfileImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unwrap(deleteProfileImage()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

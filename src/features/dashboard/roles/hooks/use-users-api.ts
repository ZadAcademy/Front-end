import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/users-api';
import { GetUsersQueryParams } from '../lib/types/roles-types';

export const useGetUsersQuery = (params: GetUsersQueryParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

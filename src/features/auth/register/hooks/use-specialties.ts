import { useQuery } from '@tanstack/react-query';
import { getSpecialties } from '../api/specialties';

export const useSpecialties = () => {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
  });
};

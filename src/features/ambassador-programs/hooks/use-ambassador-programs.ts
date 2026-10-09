import { useQuery } from '@tanstack/react-query';
import { unwrap } from '@/shared/lib/utils/api-utils';
import { getAmbassadorPrograms } from '../api/ambassador-programs-api';

export const AMBASSADOR_PROGRAMS_QUERY_KEY = ['ambassadorPrograms'];

/** Fetches all active public ambassador programs. */
export const useAmbassadorProgramsQuery = () =>
  useQuery({
    queryKey: AMBASSADOR_PROGRAMS_QUERY_KEY,
    queryFn: () => unwrap(getAmbassadorPrograms()),
    staleTime: 0,
    refetchOnMount: 'always',
  });

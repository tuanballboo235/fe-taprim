import { useQuery, QueryClient } from '@tanstack/react-query';

// Khởi tạo QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60, // Cache 1 phút
    },
  },
});

export const useFetch = (queryKey, queryFn, options = {}) => {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
};
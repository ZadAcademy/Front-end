import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOrders, getCourseOrders, updateOrderStatus } from '../api/orders-api';
import { GetOrdersQueryParams, UpdateOrderStatusRequest } from '../lib/types/orders-types';
import { toast } from 'sonner';

export const queryKeys = {
  allOrders: ['orders', 'all'] as const,
  ordersList: (params: GetOrdersQueryParams) => ['orders', 'list', params] as const,
  courseOrders: (courseId: string, params: GetOrdersQueryParams) => ['orders', 'course', courseId, params] as const,
};

export const useGetAllOrdersQuery = (params: GetOrdersQueryParams) => {
  return useQuery({
    queryKey: queryKeys.ordersList(params),
    queryFn: () => getAllOrders(params),
  });
};

export const useGetCourseOrdersQuery = (courseId: string, params: GetOrdersQueryParams) => {
  return useQuery({
    queryKey: queryKeys.courseOrders(courseId, params),
    queryFn: () => getCourseOrders(courseId, params),
    enabled: !!courseId,
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, request }: { orderId: string; request: UpdateOrderStatusRequest }) =>
      updateOrderStatus(orderId, request),
    onSuccess: (_, variables) => {
      // Invalidate both global and course-specific orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
};

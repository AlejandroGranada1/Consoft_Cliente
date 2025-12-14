import api from '@/components/Global/axios';
import { Service } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			const { data } = await api.get('/api/services');
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

export const useAddService = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newService: { nombre: string; email: string }) => {
			const { data } = await api.post('/api/services', newService);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['services'] });
		},
	});
};

export const useUpdateService = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ _id, ...rest }: Service) => {
			const { data } = await api.put(`/api/services/${_id}`, rest);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['services'] });
		},
	});
};

export const useDeleteService = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (_id: string) => {
			const { data } = await api.delete(`/api/services/${_id}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['services'] });
		},
	});
};
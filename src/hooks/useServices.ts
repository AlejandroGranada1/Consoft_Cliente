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

export const useUpdateService = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ _id, formData }: { _id: string; formData: FormData }) => {
			const { data } = await api.put(`/api/services/${_id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['services'] });
		},
	});
};

export const useAddService = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const { data } = await api.post('/api/services', formData, {
			});
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

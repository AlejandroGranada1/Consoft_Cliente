import api from '@/components/Global/axios';
import { Service } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetServices = (page: number = 1, limit: number = 20, search: string = '') => {
	return useQuery({
		queryKey: ['services', page, limit, search],
		queryFn: async () => {
			const queryParams = new URLSearchParams({
				page: String(page),
				limit: String(limit)
			});
			if (search) queryParams.append('search', search);

			const { data } = await api.get(`/api/services?${queryParams.toString()}`);
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

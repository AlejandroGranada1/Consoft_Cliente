import api from '@/components/Global/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetVisits = (page: number = 1, limit: number = 20, search: string = '') => {
	return useQuery({
		queryKey: ['visits', page, limit, search],
		queryFn: async () => {
			const queryParams = new URLSearchParams({
				page: String(page),
				limit: String(limit)
			});
			if (search) queryParams.append('search', search);

			const { data } = await api.get(`/api/visits?${queryParams.toString()}`);
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

export const useCreateVisit = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (visitData: any) => {
			const { data } = await api.post('/api/visits', visitData);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['visits'] });
		},
	});
};

export const useDeleteVisit = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await api.delete(`/api/visits/${id}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['visits'] });
		},
	});
};

export const useUpdateVisit = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: any }) => {
			const { data: res } = await api.put(`/api/visits/${id}`, data);
			return res;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['visits'] });
		},
	});
};

export const useCreateVisitForMe = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (visitData: any) => {
			const { data } = await api.post('/api/visits/mine', visitData);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['visits'] });
		},
	});
};
export const useGetAvailableSlots = (date: string | undefined) => {
	return useQuery({
		queryKey: ['available-slots', date],
		queryFn: async () => {
			if (!date) return { availableSlots: [] };
			const { data } = await api.get(`/api/visits/available-slots?date=${date}`);
			return data;
		},
		enabled: !!date,
	});
};

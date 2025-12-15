import api from '@/components/Global/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetVisits = () => {
	return useQuery({
		queryKey: ['visits'],
		queryFn: async () => {
			const { data } = await api.get('/api/visits');
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

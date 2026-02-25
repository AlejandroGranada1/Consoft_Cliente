import api from '@/components/Global/axios';
import { useQuery } from '@tanstack/react-query';
import { DashboardResponse } from '@/lib/types';

interface DashboardParams {
	from?: string;
	to?: string;
	limit?: number;
}

export const useDashboard = (params?: DashboardParams) => {
	return useQuery<DashboardResponse>({
		queryKey: ['dashboard', params],
		queryFn: async () => {
			const query = new URLSearchParams();

			if (params?.from) query.append('from', params.from);
			if (params?.to) query.append('to', params.to);
			if (params?.limit) query.append('limit', String(params.limit));

			const { data } = await api.get<DashboardResponse>(
				`/api/dashboard${query.toString() ? `?${query.toString()}` : ''}`
			);

			return data;
		},
	});
};
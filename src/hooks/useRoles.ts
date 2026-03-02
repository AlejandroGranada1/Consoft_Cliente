import { Permission } from '@/lib/types';
import api from '@/components/Global/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetRoles = () => {
	return useQuery({
		queryKey: ['roles'],
		queryFn: async () => {
			const { data } = await api.get('/api/roles');
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

export const useCreateRole = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newRole: {
			_id: string;
			name: string;
			description: string;
			status: boolean;
			permissions: Permission[];
			createdAt: Date;
			usersCount: number;
		}) => {
			const { data } = await api.post('/api/roles', newRole);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['roles'] });
		},
	});
};

export const useUpdateRole = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (updatedRole: {
			_id: string;
			name: string;
			description: string;
			status: boolean;
			permissions: string[];
		}) => {
			const { data } = await api.put(`/api/roles/${updatedRole._id}`, updatedRole);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['roles'] });
		},
	});
};

export const useGetPermissions = () => {
	return useQuery({
		queryKey: ['permissions'],
		queryFn: async () => {
			const { data } = await api.get('/api/permissions');
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

export const useDeleteRole = () => {
	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await api.delete(`/api/roles/${id}`);
			return data
		},
	});
};

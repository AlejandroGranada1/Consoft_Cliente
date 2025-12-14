import api from '@/components/Global/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const { data } = await api.get('/api/users');
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

export const useGetUserById = (id: string) => {
	return useQuery({
		queryKey: ['users', id],
		queryFn: async () => {
			const { data } = await api.get(`/api/users/${id}`);
			return data;
		},
		enabled: !!id,
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ _id, formData }: any) => {
			const { data } = await api.put(`/api/users/${_id}`, formData);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['user'] });
		},
	});
};

export const useGetProfile = () => {
	return useQuery({
		queryKey: ['profile'],
		queryFn: async () => {
			const { data } = await api.post('/api/auth/profile');
			return data;
		},
		staleTime: 1000 * 60 * 10,
	});
};

export const useCreateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (userData: { name: string; email: string; password: string }) => {
			const { data } = await api.post('/api/users', userData);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await api.delete(`/api/users/${id}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

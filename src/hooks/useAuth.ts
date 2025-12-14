import api from '@/components/Global/axios';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
	return useMutation({
		mutationFn: async (loginData: { email: string; password: string }) => {
			const response = await api.post('/api/auth/login', loginData);
			return response;
		},
	});
};

export const useLogout = () => {
	return useMutation({
		mutationFn: async () => {
			const { data } = await api.post('/api/auth/logout');
		},
	});
};

export const useForgotPassword = () => {
	return useMutation({
		mutationFn: async (email: string) => {
			const { data } = await api.post('/api/auth/forgot-password', { email });
			return data;
		},
	});
};

export const useResetPassword = () => {
	return useMutation({
		mutationFn: async ({ token, password }: { token: string; password: string }) => {
			const { data } = await api.post('/api/auth/reset-password', {
				token,
				password,
			});
			return data;
		},
	});
};

export const useGoogleLogin = () => {
	return useMutation({
		mutationFn: async (idToken: string) => {
			const { data } = await api.post('/api/auth/google', { idToken });
			return data;
		},
	});
};

export const useChangePassword = () => {
	return useMutation({
		mutationFn: async ({
			currentPassword,
			newPassword,
		}: {
			currentPassword: string;
			newPassword: string;
		}) => {
			const { data } = await api.post('/api/auth/change-password', {
				currentPassword,
				newPassword,
			});
			return data;
		},
	});
};

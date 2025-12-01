import { Product, Service } from '@/app/types';
import api from '@/components/Global/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

//* Servicios
export const useGetServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			const { data } = await api.get<Service[]>('/api/services');
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
			// Refresca la lista de servicios
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

//* Products

type productsResponse = {
	ok: string;
	products: Product[];
};

export const useGetProducts = () => {
	return useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			const response = await api.get<productsResponse>('/api/products');
			return response.data.products;
		},
	});
};

export const useGetProductById = (id: string) => {
	return useQuery({
		queryKey: ['product', id],
		queryFn: async () => {
			const { data } = await api.get<Product>(`/api/products/${id}`);
			return data;
		},
	});
};

export const useAddProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (newProduct: Product) => {
			const { data } = await api.post('/api/products', newProduct);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
};

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ _id, ...rest }: Product) => {
			const { data } = await api.put(`/api/products/${_id}`, rest);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (_id: string) => {
			const { data } = await api.delete(`/api/products/${_id}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
};

//* Users

export const useGetUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const { data } = await api.get('/api/users');
			return data;
		},
	});
};

import api from '@/components/Global/axios';
import { Product } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type ProductsResponse = {
	ok: string;
	products: Product[];
};

export const useGetProducts = () => {
	return useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			const response = await api.get<ProductsResponse>('/api/products');
			return response.data.products;
		},
		staleTime: 1000 * 60 * 5,
	});
};

export const useGetProductById = (id: string) => {
	return useQuery({
		queryKey: ['product', id],
		queryFn: async () => {
			const { data } = await api.get(`/api/products/${id}`);
			return data;
		},
		enabled: !!id,
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
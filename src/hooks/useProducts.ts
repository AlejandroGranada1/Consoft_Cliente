import api from '@/components/Global/axios';
import { Product } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type ProductsResponse = {
	ok: boolean;
	products: Product[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
};

export const useGetCategories = () => {
	return useQuery({
		queryKey: ['categories'],
		queryFn: async () => {
			const { data } = await api.get('/api/categories');
			return data;
		},
		staleTime: 1000 * 60 * 10,
	});
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await api.delete(`/api/categories/${id}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
};

export const useAddCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newCategory: any) => {
			const { data } = await api.post('/api/categories', newCategory);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
};

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ _id, ...rest }: any) => {
			const { data } = await api.put(`/api/categories/${_id}`, rest);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
};

export const useGetProducts = (page: number = 1, limit: number = 20, search: string = '', category: string = '') => {
	return useQuery({
		queryKey: ['products', page, limit, search, category],
		queryFn: async () => {
			const queryParams = new URLSearchParams({
				page: String(page),
				limit: String(limit)
			});
			if (search) queryParams.append('search', search);
			if (category) queryParams.append('category', category);

			const response = await api.get<any>(`/api/products?${queryParams.toString()}`);
			return response.data;
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
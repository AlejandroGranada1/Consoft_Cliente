import { CartItem, Product, QuotationsResponse, Service } from '@/lib/types';
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

//* Quotations

export const useGetAllCarts = () => {
	const queryClient = useQueryClient();
	return useQuery({
		queryKey: ['quotations'],
		queryFn: async () => {
			const { data } = await api.get<QuotationsResponse | undefined>('/api/quotations');
			return data;
		},
	});
};

export const useQuickQuotation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (items: CartItem) => {
			console.log(items);
			const { data } = await api.post('/api/quotations/quick', items);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['quotations'] });
		},
	});
};

export const useSetQuote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			totalEstimate,
			adminNotes,
		}: {
			id: string;
			totalEstimate: number;
			adminNotes: string;
		}) => {
			const { data } = await api.post(`/api/quotations/${id}/quote`, {
				totalEstimate,
				adminNotes,
			});
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['quotations'] });
		},
	});
};

export const useAddItemAutoCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ product, quantity = 1, color, size, notes }: CartItem) => {
			let cart: any = null;

			// 1. Verificar si ya existe carrito
			const existing = await api.get('/api/quotations/mine');
			const quotations = existing.data.quotations;

			if (quotations.length === 0) {
				// No hay carrito → crear uno
				const created = await api.post('/api/quotations/cart');
				cart = created.data.cart;
			} else {
				// Ya existe → usar el primero
				cart = quotations[0];
			}

			const quotationId = cart._id;

			// 2. Agregar item al carrito
			const { data } = await api.post(`/api/quotations/${quotationId}/items`, {
				product,
				quantity,
				color,
				size,
				notes,
			});

			return data;
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['myCart'] });
		},
	});
};

export const useUserDesicion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			quotationId,
			decision,
		}: {
			quotationId: string;
			decision: 'accept' | 'reject';
		}) => {
			const { data } = await api.post(`/api/quotations/${quotationId}/decision`, {
				decision,
			});
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['quotations'] });
		},
	});
};

export const useMyCart = () => {
	const queryClient = useQueryClient();
	return useQuery({
		queryKey: ['myCart'],
		queryFn: async () => {
			const { data } = await api.get<QuotationsResponse>('/api/quotations/mine');
			return data;
		},
	});
};

export const useUpdateCartItem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			cartId,
			itemId,
			quantity,
			color,
			notes,
		}: {
			cartId: string;
			itemId: string;
			quantity: number;
			color: string;
			notes: string;
		}) => {
			const { data } = await api.put(`/api/quotations/${cartId}/items/${itemId}`, {
				quantity,
			});
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['myCart'] });
		},
	});
};

export const usedeleteCartItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ cartId, itemId }: { cartId: string; itemId: string }) => {
			const { data } = await api.delete(`/api/quotations/${cartId}/items/${itemId}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['myCart'] });
		},
	});
};

export const useSubmitQuotation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (cartId: string) => {
			const { data } = await api.post(`/api/quotations/${cartId}/submit`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['myCart'] });
		},
	});
};

export const useGetQuotationById = (id: string) => {
	return useQuery({
		queryKey: ['quotation', id],
		queryFn: async () => {
			const { data } = await api.get(`/api/quotations/${id}`);
			return data;
		},
	});
};

export const useGetMessages = (quotationId: string) => {
	return useQuery({
		queryKey: ['messages', quotationId],
		queryFn: async () => {
			const { data } = await api.get(`/api/quotations/${quotationId}/messages`);
			console.log(data)
			return data;
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

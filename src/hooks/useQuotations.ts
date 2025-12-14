import api from '@/components/Global/axios';
import { CartItem, QuotationsResponse } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllCarts = () => {
	return useQuery({
		queryKey: ['quotations'],
		queryFn: async () => {
			const { data } = await api.get<QuotationsResponse | undefined>('/api/quotations');
			return data;
		},
		staleTime: 1000 * 60 * 2,
	});
};

export const useQuickQuotation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (items: CartItem) => {
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
			items,
		}: {
			id: string;
			totalEstimate: number;
			adminNotes: string;
			items: { _id: string; price: number; adminNotes?: string }[];
		}) => {
			const { data } = await api.post(`/api/quotations/${id}/quote`, {
				totalEstimate,
				adminNotes,
				items,
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
		mutationFn: async (item: CartItem) => {
			let cart: any = null;
			const existing = await api.get('/api/quotations/mine');
			const quotations = existing.data.quotations;

			if (quotations.length === 0) {
				const created = await api.post('/api/quotations/cart');
				cart = created.data.cart;
			} else {
				cart = quotations[0];
			}

			const { data } = await api.post(`/api/quotations/${cart._id}/items`, item);
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
	return useQuery({
		queryKey: ['myCart'],
		queryFn: async () => {
			const { data } = await api.get<QuotationsResponse>('/api/quotations/mine');
			return data;
		},
		staleTime: 1000 * 60 * 2,
	});
};

export const useUpdateCartItem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			cartId,
			itemId,
			quantity,
		}: {
			cartId: string;
			itemId: string;
			quantity: number;
			color?: string;
			notes?: string;
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

export const useDeleteCartItem = () => {
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
			const response = await api.post(`/api/quotations/${cartId}/submit`);
			return response;
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
		enabled: !!id,
	});
};

export const useGetMessages = (quotationId: string) => {
	return useQuery({
		queryKey: ['messages', quotationId],
		queryFn: async () => {
			const { data } = await api.get(`/api/quotations/${quotationId}/messages`);
			return data;
		},
		enabled: !!quotationId,
	});
};

import api from '@/components/Global/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =========================
   ADMIN — GET ALL CARTS / QUOTATIONS
========================= */

export const useGetAllCarts = () => {
	return useQuery({
		queryKey: ['allCarts'],
		queryFn: async () => {
			const { data } = await api.get('/api/quotations');
			return data;
		},
	});
};
/* =========================
   CART
========================= */

export const useMyCart = () => {
	return useQuery({
		queryKey: ['myCart'],
		queryFn: async () => {
			const { data } = await api.post('/api/quotations/cart');
			console.log(data);
			return data.cart;
		},
		staleTime: 1000 * 30,
	});
};

/* =========================
   ADD ITEM
========================= */

export const useAddItemAutoCart = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async ({ quotationId, payload }: any) => {
			const { data } = await api.post(`/api/quotations/${quotationId}/items`, payload);
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['myCart'] });
		},
	});
};

/* =========================
   ADD CUSTOM ITEM
========================= */

export const useAddCustomItem = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (payload: any) => {
			const { data } = await api.post('/api/quotations/cart/custom', payload);
			console.log(data);
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['myCart'] });
		},
	});
};

/* =========================
   UPDATE ITEM
========================= */

export const useUpdateItem = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async ({ quotationId, itemId, payload }: any) => {
			const { data } = await api.put(
				`/api/quotations/${quotationId}/items/${itemId}`,
				payload,
			);
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['myCart'] });
		},
	});
};

/* =========================
   REMOVE ITEM
========================= */

export const useRemoveItem = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async ({ quotationId, itemId }: any) => {
			const { data } = await api.delete(`/api/quotations/${quotationId}/items/${itemId}`);
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['myCart'] });
		},
	});
};

/* =========================
   SUBMIT
========================= */

export const useSubmitQuotation = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (quotationId: string) => {
			const { data } = await api.post(`/api/quotations/${quotationId}/submit`);
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['myCart'] });
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

export const useMyQuotations = () => {
	return useQuery({
		queryKey: ['myQuotations'],
		queryFn: async () => {
			const { data } = await api.get('/api/quotations/mine');
			return data.quotations;
		},
		staleTime: 1000 * 30,
	});
};

/* =========================
   USER DECISION
========================= */

export const useDecision = () => {
	return useMutation({
		mutationFn: async ({ quotationId, decision }: any) => {
			console.log(decision)
			const { data } = await api.post(
				`/api/quotations/${quotationId}/decision`,
				{ decision }
			);
			return data;
		},
	});
};

/* =========================
   CHAT — GET MESSAGES  ✅ ESTE FALTABA
========================= */

export const useGetMessages = (quotationId?: string) => {
	return useQuery({
		queryKey: ['messages', quotationId],
		enabled: !!quotationId,
		queryFn: async () => {
			const { data } = await api.get(`/api/quotations/${quotationId}/messages`);
			return data;
		},
	});
};

/* =========================
   CHAT — SEND MESSAGE
========================= */

export const useSendMessage = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async ({ quotationId, payload }: any) => {
			const { data } = await api.post(`/api/quotations/${quotationId}/messages`, payload);
			return data;
		},
		onSuccess: (_, vars) => {
			qc.invalidateQueries({
				queryKey: ['messages', vars.quotationId],
			});
		},
	});
};

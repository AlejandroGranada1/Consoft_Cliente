import api from '@/components/Global/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const calcDiasRestantes = (start?: string) => {
	if (!start) return '–';
	try {
		const hoy = new Date();
		const inicio = new Date(start);
		const fin = new Date(inicio);
		fin.setDate(fin.getDate() + 15);
		const diff = Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
		return diff <= 0 ? '0 Días' : `${diff} Días`;
	} catch (error) {
		return '–';
	}
};

export const useGetOrders = (page: number = 1, limit: number = 20, search: string = '') => {
	return useQuery({
		queryKey: ['orders', page, limit, search],
		queryFn: async () => {
			const queryParams = new URLSearchParams({
				page: String(page),
				limit: String(limit)
			});
			if (search) queryParams.append('search', search);

			const { data } = await api.get(`/api/orders?${queryParams.toString()}`);
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

export const useMyOrders = () => {
	return useQuery({
		queryKey: ['myOrders'],
		queryFn: async () => {
			const { data } = await api.get('/api/orders/mine');

			// La API devuelve { ok: true, orders: [...] }
			const orders = data.orders || [];

			return orders.map((o: any) => {
				// 🔥 ASEGURAR QUE TODOS LOS NÚMEROS SEAN NÚMEROS REALES
				// El total puede venir en o.total o en o.raw.total
				const total = Number(o.total || o.raw?.total || 0);

				// Calcular pagado desde payments (si existen en o.raw)
				let pagado = 0;
				if (o.raw?.payments && Array.isArray(o.raw.payments)) {
					pagado = o.raw.payments.reduce((acc: number, p: any) => {
						if (['aprobado', 'approved', 'confirmado', 'pagado', 'paid'].includes(p.status?.toLowerCase())) {
							return acc + (Number(p.amount) || 0);
						}
						return acc;
					}, 0);
				}

				// Si no hay payments, usar o.pagado o o.raw.pagado
				if (pagado === 0) {
					pagado = Number(o.pagado || o.raw?.pagado || 0);
				}

				const restante = total - pagado;

				// 🔥 CORRECCIÓN: requiereAbono = lo pagado es MENOR al 30%
				const requiereAbono = pagado < total * 0.3;

				// Obtener nombre del pedido
				let nombre = o.nombre || 'Pedido';
				if (!o.nombre) {
					const firstItem = o.raw?.items?.[0] || o.items?.[0];
					if (firstItem) {
						const isAdminFabricator = firstItem.id_servicio && String(firstItem.id_servicio?._id || firstItem.id_servicio) === '6999d686f21e5a62a1823865';

						if (firstItem.id_producto && typeof firstItem.id_producto === 'object' && firstItem.id_producto?.name) {
							nombre = firstItem.id_producto.name;
						} else if (firstItem.id_servicio && typeof firstItem.id_servicio === 'object' && firstItem.id_servicio?.name && !isAdminFabricator) {
							nombre = firstItem.id_servicio.name;
						} else if (firstItem.detalles) {
							const cleanDetalles = firstItem.detalles.replace('[Personalizado] ', '');
							nombre = cleanDetalles.length > 30 ? cleanDetalles.substring(0, 30) + '...' : cleanDetalles;
						}
					}
				}

				return {
					id: o.id || o.raw?._id,
					nombre,
					estado: o.estado || o.raw?.status || 'Pendiente',
					valor: `$${total.toLocaleString('es-CO')} COP`,
					restante: restante.toLocaleString('es-CO'),
					dias: o.dias || '–',
					requiereAbono,
					porcentajePagado: total > 0 ? Math.round((pagado / total) * 100) : 0,
					raw: o.raw || o,
				};
			});
		},
		staleTime: 1000 * 60 * 2,
	});
};
export const useMyOrder = (id: string) => {
	return useQuery({
		queryKey: ['pedidoDetalle', id],
		queryFn: async () => {
			const { data: o } = await api.get(`/api/orders/${id}`);

			const total = Number(o.total || 0);
			let pagado = 0;
			if (o.payments && Array.isArray(o.payments)) {
				pagado = o.payments.reduce((acc: number, p: any) => {
					if (['aprobado', 'approved', 'confirmado', 'pagado', 'paid'].includes(p.status?.toLowerCase())) {
						return acc + (Number(p.amount) || 0);
					}
					return acc;
				}, 0);
			}

			if (pagado === 0) pagado = Number(o.pagado || 0);
			const restante = total - pagado;
			const requiereAbono = pagado < total * 0.3;

			// Obtener nombre
			let nombre = o.nombre || 'Pedido';
			if (!o.nombre) {
				const firstItem = o.items?.[0];
				if (firstItem) {
					const isAdminFabricator = firstItem.id_servicio && String(firstItem.id_servicio?._id || firstItem.id_servicio) === '6999d686f21e5a62a1823865';
					if (firstItem.id_producto?.name) {
						nombre = firstItem.id_producto.name;
					} else if (firstItem.id_servicio?.name && !isAdminFabricator) {
						nombre = firstItem.id_servicio.name;
					} else if (firstItem.detalles) {
						const cleanDetalles = firstItem.detalles.replace('[Personalizado] ', '');
						nombre = cleanDetalles.length > 30 ? cleanDetalles.substring(0, 30) + '...' : cleanDetalles;
					}
				}
			}

			return {
				id: o._id,
				nombre,
				estado: o.status || 'Pendiente',
				valor: `$${total.toLocaleString('es-CO')} COP`,
				restante: `$${restante.toLocaleString('es-CO')} COP`,
				dias: calcDiasRestantes(o.startedAt),
				requiereAbono,
				total,
				pagado,
				raw: o,
			};
		},
		enabled: !!id,
	});
};

export const useSendPayment = () => {
	return useMutation({
		mutationFn: async (data: {
			orderId: string;
			amount: number;
			receiptUrl?: string;
			ocrText?: string;
			method?: string;
			reference?: string;
		}) => {
			const res = await api.post(`/api/orders/${data.orderId}/payments/ocr/submit`, {
				amount: data.amount,
				method: data.method ?? 'comprobante',
				receiptUrl: data.receiptUrl,
				reference: data.reference,
				ocrText: data.ocrText,
			});

			return res.data;
		},
	});
};

export const useDeleteOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await api.delete(`/api/orders/${id}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};

export const useCreateOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (orderData: any) => {
			const { data } = await api.post('/api/orders', orderData);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['myOrders'] });
		},
	});
};

export const useCreatePayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (paymentData: any) => {
			const { data } = await api.post('/api/payments', paymentData);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['myOrders'] });
			queryClient.invalidateQueries({ queryKey: ['pedidoDetalle'] });
		},
	});
};

export const useUpdatePaymentStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ orderId, data }: { orderId?: string; data: any }) => {
			// Assuming the endpoint for updating a payment is /api/payments/:id
			// as useCreatePayment uses /api/payments
			const { data: response } = await api.put(`/api/payments/${data.paymentId || data._id}`, { status: data.status });
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['myOrders'] });
			queryClient.invalidateQueries({ queryKey: ['pedidoDetalle'] });
		},
	});
};


export const useUpdateOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: any }) => {
			const { data: response } = await api.put(`/api/orders/${id}`, data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['myOrders'] });
			queryClient.invalidateQueries({ queryKey: ['orderDetails'] });
		},
	});
};

/* ─────────────────────────────────────────────
   useOcrReceipt — preview OCR (NO crea pago)
   Llama a POST /orders/:id/payments/ocr
───────────────────────────────────────────── */
export interface OcrResult {
	ok: boolean;
	orderId: string;
	current: { total: number; paid: number; restante: number };
	detectedAmount: number;
	detectedReference?: string | null;
	projected: { amountToPay: number; restanteAfter: number };
	receipt: { receiptUrl: string; ocrText: string };
}

export function useOcrReceipt() {
	const [data, setData] = useState<OcrResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const analyze = async (orderId: string, file: File) => {
		setLoading(true);
		setError(null);
		setData(null);
		try {
			const form = new FormData();
			form.append('payment_image', file);

			// Usa la instancia de axios que ya tiene baseURL + credentials configurados
			const res = await api.post(`/api/orders/${orderId}/payments/ocr`, form, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			setData(res.data);
		} catch (e: any) {
			const msg =
				e?.response?.data?.message || e?.message || 'No se pudo procesar el comprobante';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setData(null);
		setError(null);
	};

	return { analyze, data, loading, error, reset };
}

/* ─────────────────────────────────────────────
   REVIEWS — POST & GET
───────────────────────────────────────────── */
export const useGetOrderReviews = (orderId: string) => {
	return useQuery({
		queryKey: ['orderReviews', orderId],
		queryFn: async () => {
			const { data } = await api.get(`/api/orders/${orderId}/reviews`);
			return data.reviews || [];
		},
		enabled: !!orderId,
	});
};

export const useCreateOrderReview = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ orderId, rating, comment }: { orderId: string; rating: number; comment?: string }) => {
			const { data } = await api.post(`/api/orders/${orderId}/reviews`, { rating, comment });
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['orderReviews', variables.orderId] });
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};
export const useGetAllReviews = () => {
	return useQuery({
		queryKey: ['allReviews'],
		queryFn: async () => {
			const { data } = await api.get('/api/orders/reviews');
			return data.reviews || [];
		},
		staleTime: 1000 * 60 * 10,
	});
};

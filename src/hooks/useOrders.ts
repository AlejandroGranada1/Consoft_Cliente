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

export const useGetOrders = () => {
	return useQuery({
		queryKey: ['orders'],
		queryFn: async () => {
			const { data } = await api.get('/api/orders');
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
						if (p.status?.toLowerCase() === 'aprobado' || p.status?.toLowerCase() === 'confirmado') {
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
				
				// Obtener nombre del primer item
				let nombre = 'Pedido';
				const firstItem = o.raw?.items?.[0] || o.items?.[0];
				if (firstItem) {
					if (firstItem.id_servicio && typeof firstItem.id_servicio === 'object' && firstItem.id_servicio?.name) {
						nombre = firstItem.id_servicio.name;
					} else if (firstItem.id_producto && typeof firstItem.id_producto === 'object' && firstItem.id_producto?.name) {
						nombre = firstItem.id_producto.name;
					} else if (firstItem.detalles) {
						nombre = firstItem.detalles;
					}
				}
				
				// 🔥 LOG PARA DEBUG (opcional, puedes quitarlo después)
				console.log({
					id: o.id,
					nombre,
					total,
					pagado,
					restante,
					treinta: total * 0.3,
					requiereAbono
				});
				
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
			const { data } = await api.get(`/api/orders/${id}`);
			const pagado =
				data.payments?.reduce((acc: number, p: any) => acc + (p.amount || 0), 0) || 0;
			const restante = (data.total || 0) - pagado;
			return {
				id: data._id,
				nombre: data.items?.[0]?.id_servicio?.name || 'Pedido',
				estado: data.paymentStatus === 'Pagado' ? 'Listo' : 'Pendiente',
				valor: `$${data.total.toLocaleString()} COP`,
				restante: `$${restante.toLocaleString()} COP`,
				dias: calcDiasRestantes(data.startedAt),
				raw: data,
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
		}) => {
			const res = await api.post(`/api/orders/${data.orderId}/payments/ocr/submit`, {
				amount: data.amount,
				method: data.method ?? 'comprobante',
				receiptUrl: data.receiptUrl,
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

export const useGetServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			const { data } = await api.get('/api/services');
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

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

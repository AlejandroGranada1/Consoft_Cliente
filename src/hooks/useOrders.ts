import api from '@/components/Global/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const calcDiasRestantes = (start?: string) => {
	if (!start) return '–';
	const hoy = new Date();
	const inicio = new Date(start);
	const fin = new Date(inicio);
	fin.setDate(fin.getDate() + 15);
	const diff = Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
	return diff <= 0 ? '0 Días' : `${diff} Días`;
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

      const APPROVED = new Set(['aprobado', 'confirmado']);

      return data.orders.map((o: any) => {

        const pagado =
          o.payments?.reduce((acc: number, p: any) => {
            const status = String(p.status || '').toLowerCase();
            return APPROVED.has(status)
              ? acc + (p.amount || 0)
              : acc;
          }, 0) || 0;

        const restante = (o.total || 0) - pagado;

        return {
          id: o._id,
          nombre: o.items?.[0]?.id_servicio?.name || 'Pedido',
          estado: o.paymentStatus === 'Pagado' ? 'Listo' : 'Pendiente',
          valor: `$${o.total.toLocaleString()} COP`,
          restante: `${restante.toLocaleString()} COP`,
          dias: calcDiasRestantes(o.startedAt),
          raw: o,
        };
      });
    },
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

      const res = await api.post(
        `/api/orders/${data.orderId}/payments/ocr/submit`,
        {
          amount: data.amount,
          method: data.method ?? 'comprobante',
          receiptUrl: data.receiptUrl,
          ocrText: data.ocrText,
        }
      );

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
			const res = await api.post(
				`/api/orders/${orderId}/payments/ocr`,
				form,
				{ headers: { 'Content-Type': 'multipart/form-data' } }
			);

			setData(res.data);
		} catch (e: any) {
			const msg =
				e?.response?.data?.message ||
				e?.message ||
				'No se pudo procesar el comprobante';
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
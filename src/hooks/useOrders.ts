import api from '@/components/Global/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

			return data.orders.map((o: any) => {
				const pagado =
					o.payments?.reduce((acc: number, p: any) => acc + (p.amount || 0), 0) || 0;
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
			payment_image: File;
			tipoPago: 'abono' | 'final';
		}) => {
			const formData = new FormData();
			formData.append('payment_image', data.payment_image);
			formData.append('status', 'pendiente');
			formData.append('method', data.tipoPago);
			formData.append('orderId', data.orderId);

			const res = await api.post(`/api/orders/${data.orderId}/payments/ocr`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
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

// hooks/apiHooks.ts - Agregar esto
export const useCreateOrder = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async (orderData: any) => {
			const { data } = await api.post('/api/orders', orderData);
			return data;
		},
		onSuccess: () => {
			// Invalidar todas las queries relacionadas con órdenes
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['myOrders'] });
		},
	});
};

// Y actualizar el hook useGetServices para devolver correctamente los datos:
export const useGetServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			const { data } = await api.get('/api/services');
			return data; // Asegúrate que devuelva { services: [...] }
		},
		staleTime: 1000 * 60 * 5,
	});
};

// Y useGetUsers:
export const useGetUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const { data } = await api.get('/api/users');
			return data; // Asegúrate que devuelva { users: [...] }
		},
		staleTime: 1000 * 60 * 5,
	});
};

// hooks/apiHooks.ts
export const useUpdateOrder = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: any }) => {
			const { data: response } = await api.put(`/api/orders/${id}`, data);
			return response;
		},
		onSuccess: () => {
			// Invalidar todas las queries relacionadas
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['myOrders'] });
			queryClient.invalidateQueries({ queryKey: ['orderDetails'] });
		},
	});
};
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

// hooks/apiHooks.ts - Versión corregida
// hooks/apiHooks.ts - Versión final corregida
export const useAddItemAutoCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (item: CartItem) => {
			try {
				// 1. Buscar TODAS las cotizaciones del usuario
				const existing = await api.get('/api/quotations/mine');
				const quotations = existing.data.quotations || [];

				// 2. Buscar específicamente un carrito activo (estado "Carrito" EXACTO)
				//    IMPORTANTE: El backend usa 'Carrito' con C mayúscula
				let activeCart = quotations.find((q: any) => q.status === 'Carrito');

				console.log('📦 Carritos encontrados:', quotations.length);
				console.log('📦 Carritos activos (estado "Carrito"):', activeCart ? 'Sí' : 'No');
				console.log(
					'📦 Estados encontrados:',
					quotations.map((q: any) => q.status)
				);

				// 3. Si no hay carrito activo, crear uno nuevo
				if (!activeCart) {
					console.log('🆕 Creando nuevo carrito...');
					const created = await api.post('/api/quotations/cart');
					activeCart = created.data.cart;
					console.log(
						'🆕 Nuevo carrito creado:',
						activeCart._id,
						'Estado:',
						activeCart.status
					);
				} else {
					console.log(
						'✅ Usando carrito existente:',
						activeCart._id,
						'Estado:',
						activeCart.status
					);
				}

				// 4. Verificar que el carrito esté realmente en estado "Carrito" (exacto)
				if (activeCart.status !== 'Carrito') {
					console.warn('⚠️ Carrito no está en estado "Carrito", creando uno nuevo...');
					const created = await api.post('/api/quotations/cart');
					activeCart = created.data.cart;
					console.log(
						'🆕 Nuevo carrito creado:',
						activeCart._id,
						'Estado:',
						activeCart.status
					);
				}

				// 5. Agregar el item al carrito activo
				console.log('➕ Agregando item al carrito:', activeCart._id);
				const { data } = await api.post(`/api/quotations/${activeCart._id}/items`, item);

				return data;
			} catch (error: any) {
				console.error('❌ Error en useAddItemAutoCart:', error);

				// Mejor manejo de errores
				if (error.response?.status === 400) {
					const message = error.response?.data?.message || '';
					console.log('🔍 Error 400 detectado:', message);

					if (message.includes('Cannot modify quotation')) {
						// El carrito ya no es modificable (probablemente ya fue enviado)
						// Crear uno nuevo automáticamente y reintentar
						console.log('🔄 Carrito no modificable, creando nuevo...');

						try {
							// Crear nuevo carrito
							const created = await api.post('/api/quotations/cart');
							const newCart = created.data.cart;
							console.log(
								'🆕 Nuevo carrito creado:',
								newCart._id,
								'Estado:',
								newCart.status
							);

							// Reintentar con el nuevo carrito
							const { data } = await api.post(
								`/api/quotations/${newCart._id}/items`,
								item
							);
							return data;
						} catch (retryError) {
							console.error('❌ Error en reintento:', retryError);
							throw retryError;
						}
					}
				}

				throw error;
			}
		},
		onSuccess: () => {
			// Invalidar ambas queries para asegurar que los datos se actualicen
			queryClient.invalidateQueries({ queryKey: ['myCart'] });
			queryClient.invalidateQueries({ queryKey: ['quotations'] });
		},
		onError: (error) => {
			console.error('❌ Mutation error in useAddItemAutoCart:', error);
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

// hooks/apiHooks.ts
export const useMyCart = () => {
	return useQuery({
		queryKey: ['myCart'],
		queryFn: async () => {
			const { data } = await api.get('/api/quotations/mine');

			// Filtrar solo los carritos activos (estado "Carrito")
			const quotations = data.quotations || [];
			const activeCarts = quotations.filter(
				(q: any) => q.status?.toLowerCase() === 'carrito'
			);

			return {
				...data,
				quotations: activeCarts, // Solo devolvemos carritos activos
				allQuotations: quotations, // Mantenemos todas por si acaso
				hasActiveCart: activeCarts.length > 0,
			};
		},
		// Opcional: Refrescar cada 30 segundos
		refetchInterval: 30000,
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

// hooks/apiHooks.ts
// hooks/apiHooks.ts
export const useDeleteCartItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ cartId, itemId }: { cartId: string; itemId: string }) => {
			if (!cartId || !itemId) {
				throw new Error('cartId e itemId son requeridos');
			}

			try {
				const { data } = await api.delete(`/api/quotations/${cartId}/items/${itemId}`);
				return data;
			} catch (error: any) {
				// Log detallado para debugging
				console.error('Error en delete item:', {
					cartId,
					itemId,
					status: error.response?.status,
					message: error.response?.data?.message,
					error,
				});
				throw error;
			}
		},
		onSuccess: () => {
			// Invalidar todas las queries relacionadas
			queryClient.invalidateQueries({ queryKey: ['myCart'] });
			queryClient.invalidateQueries({ queryKey: ['quotations'] });
		},
		onError: (error) => {
			console.error('Error deleting cart item:', error);

			// Podrías mostrar una notificación global aquí si quieres
			const event = new CustomEvent('cart-error', {
				detail: {
					message: 'Error al eliminar producto del carrito',
					error,
				},
			});
			window.dispatchEvent(event);
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

// hooks/apiHooks.ts
export const useMyNotifications = () => {
	return useQuery({
		queryKey: ['myNotifications'],
		queryFn: async () => {
			const { data } = await api.get('/api/quotations/mine');
			const allQuotations = data.quotations || [];

			// Filtrar solo notificaciones
			const notifications = allQuotations.filter(
				(q: any) =>
					[
						'Solicitada',
						'cotizada',
						'Aprobada',
						'Rechazada',
						'Completada',
						'Revisada',
					].includes(q.status) && q.status?.toLowerCase() !== 'carrito'
			);

			return {
				...data,
				notifications,
				hasNotifications: notifications.length > 0,
				total: notifications.length,
			};
		},
		refetchInterval: 30000,
	});
};

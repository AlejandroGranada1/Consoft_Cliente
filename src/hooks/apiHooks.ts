import {
	CartItem,
	Permission,
	Product,
	QuotationsResponse,
	Role,
	Service,
	User,
} from '@/lib/types';
import api from '@/components/Global/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

//* Roles

export const useGetRoles = () => {
	return useQuery({
		queryKey: ['roles'],
		queryFn: async () => {
			const { data } = await api.get('/api/roles');
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

export const useCreateRole = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newRole: {
			_id: string;
			name: string;
			description: string;
			status: boolean;
			permissions: Permission[];
			createdAt: Date;
			usersCount: number;
		}) => {
			const { data } = await api.post('/api/roles', newRole);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['roles'] });
		},
	});
};

export const useUpdateRole = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (updatedRole: {
			_id: string;
			name: string;
			description: string;
			status: boolean;
			permissions: string[];
		}) => {
			const { data } = await api.put(`/api/roles/${updatedRole._id}`, updatedRole);
			return data;
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['roles'] });
		},
	});
};

//* Permisos

export const useGetPermissions = () => {
	return useQuery({
		queryKey: ['permissions'],
		queryFn: async () => {
			const { data } = await api.get('/api/permissions');
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

//* Visitas

export const useGetVisits = () => {
	return useQuery({
		queryKey: ['visits'],
		queryFn: async () => {
			const { data } = await api.get('/api/visits');
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

export const useAddVisit = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newVisit: {
			user: string;
			visitDate: Date;
			address: string;
			status: string;
			services: string;
		}) => {
			const { data } = await api.post('/api/visits', newVisit);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['visits'] });
		},
	});
};

//* Servicios
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
			const { data } = await api.get(`/api/products/${id}`);
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
			items, // <-- agregamos items
		}: {
			id: string;
			totalEstimate: number;
			adminNotes: string;
			items: { _id: string; price: number; adminNotes?: string }[]; // cada item con price
		}) => {
			const { data } = await api.post(`/api/quotations/${id}/quote`, {
				totalEstimate,
				adminNotes,
				items, // enviamos los items
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
			const { data } = await api.post(`/api/quotations/${quotationId}/items`, item);

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
			console.log(data);
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

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ _id, formData }: any) => {
			const { data } = await api.put(`/api/users/${_id}`, formData);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

export const useGetProfile = () => {
	return useQuery({
		queryKey: ['profile'],
		queryFn: async () => {
			const { data } = await api.post('/api/auth/profile');
			return data;
		},
	});
};

export const useCreateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (userData: { name: string; email: string; password: string }) => {
			const { data } = await api.post('/api/users', userData);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

//* Forgot Password
export const useForgotPassword = () => {
	const mutation = useMutation({
		mutationFn: async (email: string) => {
			const { data } = await api.post('/api/auth/forgot-password', { email });
			return data;
		},
	});

	return mutation;
};

//* Reset Password
export const useResetPassword = () => {
	return useMutation({
		mutationFn: async ({
			token,
			password,
		}: {
			token: string;
			password: string;
		}) => {
			const { data } = await api.post("/api/auth/reset-password", {
				token,
				password,
			});
			return data;
		},
	});
};

export const useGoogleLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id) => {
			const { data } = await api.post("/api/auth/google", id)
			return data
		}
	})

}

export const useGetOrders = () => {
	return useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const { data } = await api.get("/api/orders");
			return data;
		},
	});
};

//* My Orders (usuario autenticado)
export const useMyOrders = () => {
	return useQuery({
		queryKey: ["myOrders"],
		queryFn: async () => {
			const { data } = await api.get("/api/orders/mine");

			// Transformamos los datos como tu frontend los necesita
			return data.orders.map((o: any) => ({
				id: o._id,
				nombre: o.items?.[0]?.id_servicio?.name || "Pedido",
				estado: o.paymentStatus === "Pagado" ? "Listo" : "Pendiente",
				valor: `$${o.total.toLocaleString()} COP`,
				dias: calcDiasRestantes(o.startedAt),
				raw: o, // si quieres usar info completa en detalles
			}));
		},
	});
};

// Utilidad usada por el hook
const calcDiasRestantes = (start?: string) => {
	if (!start) return "–";

	const hoy = new Date();
	const inicio = new Date(start);

	// Sumar 15 días
	const fin = new Date(inicio);
	fin.setDate(fin.getDate() + 15);

	const diff = Math.ceil(
		(fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
	);

	return diff <= 0 ? "0 Días" : `${diff} Días`;
};
export interface pagination {
	size: number;
}

export interface DefaultModalProps<T = {}> {
	isOpen: boolean;
	onClose: () => void;
	extraProps?: T;
	updateList?: () => void;
}

// ✅ Permissions
export interface Permission {
	_id: string;
	module: string; // e.g. "Users"
	action: string; // e.g. "create"
}

export interface GroupPermission {
	module: string;
	permissions: Permission[];
}

// ✅ Roles
export interface Role {
	_id: string;
	name: string;
	description?: string;
	usersCount: number;
	status: boolean;
	createdAt: string | Date; // ISO date string
	permissions: Permission[]; // Array of Permission IDs
}

// ✅ Users
export interface User {
	_id: string | undefined;
	name: string;
	email: string;
	password?: string;
	address?: string;
	phone?: string;
	role: Role | string; // Role ID
	status: boolean;
	registeredAt: string; // ISO date string
	featuredProducts: Product[];
}

// ✅ Categories
export interface Category {
	_id: string | undefined;
	name: string;
	description?: string;
	products: Product[];
}

// ✅ Products
export interface Product {
	_id: string | undefined;
	name: string;
	description?: string;
	category: Category; // Category ID
	status: boolean; // e.g. "Available"
	imageUrl?: string;
}

// ✅ Services
export interface Service {
	_id: string | undefined;
	name: string;
	description?: string;
	imageUrl?: string;
	status: boolean;
}

// ✅ Visits
export interface Visit {
	_id: string | undefined;
	user: User; // User ID
	visitDate: Date; // ISO date string
	address: string;
	status: string;
	services: Visit[]; // Array of Service IDs
}

export interface OrderItem {
	_id?: string; // lo pones opcional para nuevos items
	id_servicio: string | Service; // 👈 puede ser ID o documento populado
	detalles?: string;
	valor: number;
}

//! PENDIENTE POR REVISION
export interface Attachment {
	id: string;
	fileUrl: string;
	type: string;
	uploadedBy: string; // User ID
	uploadedAt: string; // ISO date string
}

export interface Order {
	_id: string | undefined;
	user: string | User; // User ID
	status: string; // e.g. "In process", "Completed"
	address: string;
	startedAt: string;
	deliveredAt?: string;
	rating?: number;
	items: OrderItem[];
	payments: Payment[];
	paymentStatus: string;
}

export type OrderWithPartialUser = Omit<Order, 'user'> & { user: string | Partial<User> };

export interface Sale {
	_id: string;
	order: Order;
	total: number;
	paid: number;
	restante: number;
	user: {
		_id: string;
		name: string;
	};
}

export interface PaymentDetails {
	summary: PaymentSummary;
	payment: Payment;
}

export interface Payment {
	_id: string;
	amount: number;
	paidAt: Date;
	method: string;
	restante: number;
	status: string;
}

export interface PaymentSummary {
	_id: string; // id del pedido
	total: number; // total del pedido
	order: Order;
	paid: number; // total pagado
	restante: number; // lo que falta
	payments: Payment[]; // lista de pagos
}

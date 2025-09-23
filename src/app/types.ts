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
	createdAt: string; // ISO date string
	permissions: Permission[]; // Array of Permission IDs
}

// ✅ Users
export interface User {
	_id: string;
	name: string;
	email: string;
	password?: string;
	address?: string;
	phone?: string;
	role: Role; // Role ID
	status: boolean;
	registeredAt: string; // ISO date string
	featuredProducts: Product[];
}

// ✅ Categories
export interface Category {
	id: string;
	name: string;
	description?: string;
	products: Product[];
	status: boolean;
}

// ✅ Products
export interface Product {
	id: string;
	name: string;
	description?: string;
	category: Category; // Category ID
	status: boolean; // e.g. "Available"
	imageUrl?: string;
}

// ✅ Services
export interface Service {
	id: string;
	name: string;
	description?: string;
	imageUrl?: string;
	status: boolean;
}

// ✅ Visits
export interface Visit {
	id: string;
	user: User; // User ID
	scheduledAt: string; // ISO date string
	address: string;
	status: string;
	services: Visit[]; // Array of Service IDs
}

// ✅ Orders
export interface OrderItem {
	service: string; // Service ID
	details?: string;
	valor: number;
}

export interface Payment {
	id: string;
	amount: number;
	paymentDate: string; // ISO date string
	method: string;
	status: string; // e.g. "Pending", "Approved"
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
	_id: string;
	user: User; // User ID
	status: string; // e.g. "In process", "Completed"
	address: string;
	startDate: string;
	endDate?: string;
	rating?: number;
	items: OrderItem[];
	payments: Payment[];
	paymentStatus: string;
	attachments?: Attachment[];
}

export interface Sale {
	_id: string;
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
	paidAt: string;
	method: string;
	restante: number;
	status: string;
}

export interface PaymentSummary {
	_id: string; // id del pedido
	total: number; // total del pedido
	paid: number; // total pagado
	restante: number; // lo que falta
	payments: Payment[]; // lista de pagos
}

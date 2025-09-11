export interface pagination {
	size: number;
}

export interface DefaultModalProps<T = {}> {
	isOpen: boolean;
	onClose: () => void;
	extraProps?: T;
}

// ✅ Permissions
export interface Permission {
	id: string;
	module: string; // e.g. "Users"
	action: string; // e.g. "create"
}

// ✅ Roles
export interface Role {
	id: string;
	name: string;
	description?: string;
	usersCount: number;
	status: boolean;
	createdAt: string; // ISO date string
	permissions: Permission[]; // Array of Permission IDs
}

// ✅ Users
export interface User {
	id: string;
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
	value: number;
}

export interface Payment {
	id: string;
	amount: number;
	paymentDate: string; // ISO date string
	method: string;
	status: string; // e.g. "Pending", "Approved"
}

export interface Attachment {
	id: string;
	fileUrl: string;
	type: string;
	uploadedBy: string; // User ID
	uploadedAt: string; // ISO date string
}

export interface Order {
	id: string;
	user: string; // User ID
	status: string; // e.g. "In process", "Completed"
	address: string;
	startDate: string;
	endDate?: string;
	rating?: number;
	items: OrderItem[];
	payments: Payment[];
	attachments: Attachment[];
}

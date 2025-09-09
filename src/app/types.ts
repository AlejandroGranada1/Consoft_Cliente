export interface pagination {
    size: number;
}

export interface DefaultModalProps<T = {}> {
    isOpen: boolean;
    onClose: () => void;
    extraProps?: T;
}

export interface PermissionProps {
    id: string;
    module: string;
    action: string;
}

export interface RoleProps {
    id?: string;
    name: string;
    description: string;
    users?: number;
    createDate?: Date;
    permissions: PermissionProps[]
    status?: boolean;
}

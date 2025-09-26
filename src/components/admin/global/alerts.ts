import api from '@/components/Global/axios';
import Swal from 'sweetalert2';

export async function deleteElement(title: string, endpoint: string, updateList: () => void) {
	const result = await Swal.fire({
		title: `Estas a punto de eliminar este ${title}`,
		html: 'Esta accion es irreversible',
		icon: 'warning',
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		confirmButtonText: 'Eliminar',
		confirmButtonColor: 'red',
	});

	if (result.isConfirmed) {
		try {
			const response = await api.delete(endpoint);
			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				title: `${title} Eliminado con éxito`,
				icon: 'success',
				timer: 1500,
				showConfirmButton: false,
				position: 'top-right',
				customClass: {
					timerProgressBar: 'swal2-progress-bar',
				},
			});
			updateList();
			return response.data;
		} catch (error) {
			Swal.fire({
				title: 'Error al Eliminar',
				text: (error as Error).message,
				icon: 'error',
			});
			throw error;
		}
	}

	return null; // si canceló
}

export async function createElement(
	title: string,
	endpoint: string,
	data: object,
	updateList?: () => void
) {
	const result = await Swal.fire({
		title: `Agregar un nuevo ${title}`,
		icon: 'info',
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		confirmButtonText: 'Agregar',
		confirmButtonColor: 'blue',
	});

	if (result.isConfirmed) {
		try {
			const response = await api.post(endpoint, data);
			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				title: `${title} agregado con exito`,
				icon: 'success',
				timer: 1500,
				showConfirmButton: false,
				position: 'top-right',
				customClass: {
					timerProgressBar: 'swal2-progress-bar',
				},
			});
			updateList!();
			return response.data;
		} catch (error) {
			Swal.fire({
				title: 'Error al agregar',
				text: (error as Error).message,
				icon: 'error',
			});
			throw error;
		}
	}

	return null; // si canceló
}

export async function updateElement(
	title: string,
	endpoint: string,
	data: object,
	updateList?: () => void
) {
	const result = await Swal.fire({
		title: `Actualizarás la información de este ${title}`,
		icon: 'warning',
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		confirmButtonText: 'Actualizar',
	});

	if (result.isConfirmed) {
		try {
			const response = await api.put(endpoint, data);
			Swal.fire({
				toast: true,
				animation: false,
				timerProgressBar: true,
				title: `${title} actualizado con éxito`,
				icon: 'success',
				timer: 1500,
				showConfirmButton: false,
				position: 'top-right',
				customClass: {
					timerProgressBar: 'swal2-progress-bar',
				},
			});
			updateList!();

			return response.data;
		} catch (error) {
			Swal.fire({
				title: 'Error al actualizar',
				text: (error as Error).message,
				icon: 'error',
			});
			throw error;
		}
	}

	return null; // si canceló
}

import Swal from 'sweetalert2';

export default function deleteElement(title: string) {
    return Swal.fire({
        title: `¿Quieres eliminar este ${title}?`,
        html: 'Esta accion no se puede revertir',
        icon: 'warning',
        confirmButtonText: `Eliminar ${title}`,
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
    })
}

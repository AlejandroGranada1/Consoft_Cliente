'use client';

import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import Swal from 'sweetalert2';

export default function RegisterPage() {
	const router = useRouter();

	const handleSubmit  = async  () => {
		try {
      

		} catch (error) {
			Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
		}
	}
	return (
		<AuthLayout
			title='Bienvenido a Confort & Estilo'
			subtitle='Registro'
			illustration='/auth/Registrar.png'>
			<form className='flex flex-col gap-4'>
				<AuthInput
					label='Correo Electrónico'
					type='email'
					placeholder='ejemplo@email.com'
				/>
				<AuthInput
					label='Nombre'
					type='text'
					placeholder='Tu nombre'
				/>
				<AuthInput
					label='Contraseña'
					type='password'
					placeholder='********'
				/>
				<AuthInput
					label='Confirmar Contraseña'
					type='password'
					placeholder='********'
				/>

				<AuthButton text='Continuar' />
			</form>
		</AuthLayout>
	);
}

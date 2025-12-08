'use client';

import { Button } from '@/components/ui/button';
import { useGetServices } from '@/hooks/apiHooks';
import { Service } from '@/lib/types';

interface ServiceSelectorProps {
	value?: string;
	onSelect: (service: string) => void;
}

export function ServiceSelector({ value, onSelect }: ServiceSelectorProps) {
	const { data: services } = useGetServices();
	const defaultServices = services?.data;

	return (
		<div className='flex flex-wrap gap-3 justify-center'>
			{defaultServices?.map((service: Service) => (
				<Button
					key={service._id}
					onClick={() => onSelect(service._id!)}
					type='button'
					className={`px-4 py-2 rounded-xl shadow-md transition font-medium ${
						value === service._id
							? 'bg-[#8B5E3C] text-white'
							: 'bg-[#F5F5F5] text-gray-800 hover:bg-[#E6D8C3]'
					}`}>
					{service.name}
				</Button>
			))}
		</div>
	);
}

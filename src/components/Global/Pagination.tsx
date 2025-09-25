'use client';
import { useState } from 'react';
import Pagination from '@mui/material/Pagination';

interface PaginatedListProps<T> {
	data: T[];
	itemsPerPage?: number;
	children: (item: T) => React.ReactNode;
}

export default function PaginatedList<T>({
	data,
	itemsPerPage = 5,
	children,
}: PaginatedListProps<T>) {
	const [page, setPage] = useState(1);

	const totalPages = Math.ceil(data.length / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage;
	const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

	return (
		<div className='w-full'>
			{/* Lista */}
			<div className='flex flex-col gap-4'>
				{paginatedData.map((item, idx) => (
					<div key={idx}>{children(item)}</div>
				))}
				{data.length === 0 && (
					<p className='text-center text-gray-500 py-5'>
						No hay resultados para mostrar.
					</p>
				)}
			</div>

			{/* Paginación */}
			<div className='w-full flex justify-center mt-5'>
				<Pagination
					count={totalPages}
					page={page}
					onChange={(_, value) => setPage(value)}
				/>
			</div>
		</div>
	);
}

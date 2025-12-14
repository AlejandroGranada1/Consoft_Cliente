import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
	count: number;
	page: number;
	onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
	className?: string;
}

export default function Pagination({ count, page, onChange, className = '' }: PaginationProps) {
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= count) {
			onChange({} as React.ChangeEvent<unknown>, newPage);
		}
	};

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const showEllipsis = count > 7;

		if (!showEllipsis) {
			// Si hay 7 páginas o menos, mostrar todas
			for (let i = 1; i <= count; i++) {
				pages.push(i);
			}
		} else {
			// Lógica con ellipsis
			if (page <= 3) {
				// Inicio: [1, 2, 3, 4, ..., count]
				pages.push(1, 2, 3, 4, '...', count);
			} else if (page >= count - 2) {
				// Final: [1, ..., count-3, count-2, count-1, count]
				pages.push(1, '...', count - 3, count - 2, count - 1, count);
			} else {
				// Medio: [1, ..., page-1, page, page+1, ..., count]
				pages.push(1, '...', page - 1, page, page + 1, '...', count);
			}
		}

		return pages;
	};

	return (
		<div className={`flex items-center justify-center gap-1 ${className}`}>
			{/* Botón anterior */}
			<button
				onClick={() => handlePageChange(page - 1)}
				disabled={page === 1}
				className='flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
				aria-label='Página anterior'>
				<ChevronLeft className='w-4 h-4' />
			</button>

			{/* Números de página */}
			{getPageNumbers().map((pageNum, index) => {
				if (pageNum === '...') {
					return (
						<span
							key={`ellipsis-${index}`}
							className='flex items-center justify-center w-9 h-9 text-gray-400'>
							...
						</span>
					);
				}

				return (
					<button
						key={pageNum}
						onClick={() => handlePageChange(pageNum as number)}
						className={`flex items-center justify-center w-9 h-9 rounded-md border transition-colors ${
							page === pageNum
								? 'bg-blue-600 text-white border-blue-600 font-medium'
								: 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
						}`}
						aria-label={`Página ${pageNum}`}
						aria-current={page === pageNum ? 'page' : undefined}>
						{pageNum}
					</button>
				);
			})}

			{/* Botón siguiente */}
			<button
				onClick={() => handlePageChange(page + 1)}
				disabled={page === count}
				className='flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
				aria-label='Página siguiente'>
				<ChevronRight className='w-4 h-4' />
			</button>
		</div>
	);
}

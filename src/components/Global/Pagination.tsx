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
		<div className={`flex items-center justify-center gap-2 ${className}`}>
			{/* Botón anterior */}
			<button
				onClick={() => handlePageChange(page - 1)}
				disabled={page === 1}
				className='flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm'
				aria-label='Página anterior'>
				<ChevronLeft className='w-4.5 h-4.5' />
			</button>

			{/* Números de página */}
			<div className="flex items-center gap-1.5">
				{getPageNumbers().map((pageNum, index) => {
					if (pageNum === '...') {
						return (
							<span
								key={`ellipsis-${index}`}
								className='flex items-center justify-center w-10 h-10 text-white/20 font-medium'>
								...
							</span>
						);
					}

					const isActive = page === pageNum;

					return (
						<button
							key={pageNum}
							onClick={() => handlePageChange(pageNum as number)}
							className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 text-sm font-medium ${isActive
								? 'bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-lg shadow-[#8B5E3C]/20'
								: 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/20'
								}`}
							aria-label={`Página ${pageNum}`}
							aria-current={isActive ? 'page' : undefined}>
							{pageNum}
						</button>
					);
				})}
			</div>

			{/* Botón siguiente */}
			<button
				onClick={() => handlePageChange(page + 1)}
				disabled={page === count}
				className='flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm'
				aria-label='Página siguiente'>
				<ChevronRight className='w-4.5 h-4.5' />
			</button>
		</div>
	);
}

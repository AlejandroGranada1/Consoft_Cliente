export const formatCOP = (value?: number | string) => {
	if (value === undefined || value === null || value === '') return '';

	const num = Number(value);
	if (isNaN(num)) return '';

	return num.toLocaleString('es-CO', {
		style: 'currency',
		currency: 'COP',
		maximumFractionDigits: 0,
	});
};

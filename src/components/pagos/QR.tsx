import Image from 'next/image';

interface QRProps {
	type: string;
}

function QR({ type }: QRProps) {
	const src = type === 'Nequi' ? '/pagos/qrnequi.png' : '/pagos/qrbanco.png';

	return (
		<Image
			src={src}
			alt={`Codigo QR de ${type}`}
			width={400}
			height={400}
			priority
		/>
	);
}

export default QR;

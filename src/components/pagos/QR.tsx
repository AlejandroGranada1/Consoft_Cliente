import Image from 'next/image';

interface QRProps {
	type: string;
}

function QR({ type }: QRProps) {
	const src = type === 'Nequi' ? '/pagos/nequi.webp' : '/pagos/bancolombia.png';

	return (
		<Image
			src={src}
			alt={`Codigo QR de ${type}`}
			width={250}
			height={250}
			priority
		/>
	);
}

export default QR;

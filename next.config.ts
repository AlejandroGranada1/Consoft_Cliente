import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
		],
	},
	async headers() {
		return [
			{
				source: '/client/auth/login',
				headers: [
					{
						key: 'Cross-Origin-Opener-Policy',
						value: 'unsafe-none',
					},
					{
						key: 'Cross-Origin-Embedder-Policy',
						value: 'unsafe-none',
					},
				],
			},
		];
	},
};

export default nextConfig;

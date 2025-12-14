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
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	experimental: {
		optimizePackageImports: ['lucide-react'],
	},
	// Optimización de chunks
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.optimization = {
				...config.optimization,
				splitChunks: {
					chunks: 'all',
					cacheGroups: {
						default: false,
						vendors: false,
						// Vendor chunk para librerías grandes
						vendor: {
							name: 'vendor',
							chunks: 'all',
							test: /node_modules/,
							priority: 20,
						},
						// Chunk separado para admin
						admin: {
							name: 'admin',
							test: /[\\/]app[\\/]admin[\\/]/,
							priority: 30,
						},
						// Chunk separado para componentes comunes
						common: {
							name: 'common',
							minChunks: 2,
							priority: 10,
							reuseExistingChunk: true,
						},
					},
				},
			};
		}
		return config;
	},
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
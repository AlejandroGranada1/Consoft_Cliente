import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
		],
		// ✅ Formatos modernos para mejor rendimiento
		formats: ['image/avif', 'image/webp'],
		// ✅ Minimiza los tamaños de imagen
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
			// ✅ Headers de caché para assets estáticos
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on',
					},
				],
			},
		];
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/:path*`,
			},
		];
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	experimental: {
		// ✅ Optimiza imports de librerías grandes
		optimizePackageImports: [
			'lucide-react',
			'@headlessui/react',
			'@radix-ui/react-dropdown-menu',
			'date-fns',
		],
		// ✅ Mejora el rendimiento de navegación
		optimisticClientCache: true,
	},
	// ✅ Configuración mejorada de webpack
	webpack: (config, { isServer, dev }) => {
		if (!isServer) {
			config.optimization = {
				...config.optimization,
				moduleIds: 'deterministic',
				runtimeChunk: 'single',
				splitChunks: {
					chunks: 'all',
					maxInitialRequests: 25,
					minSize: 20000,
					cacheGroups: {
						// Librerías de React
						react: {
							test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
							name: 'react',
							priority: 40,
							reuseExistingChunk: true,
						},
						// Librerías UI grandes
						ui: {
							test: /[\\/]node_modules[\\/](@headlessui|@radix-ui)[\\/]/,
							name: 'ui-libs',
							priority: 35,
							reuseExistingChunk: true,
						},
						// Socket.io (carga bajo demanda)
						socket: {
							test: /[\\/]node_modules[\\/](socket\.io-client)[\\/]/,
							name: 'socket',
							priority: 38,
							reuseExistingChunk: true,
						},
						// SweetAlert2 (carga bajo demanda)
						sweetalert: {
							test: /[\\/]node_modules[\\/](sweetalert2)[\\/]/,
							name: 'sweetalert',
							priority: 38,
							reuseExistingChunk: true,
						},
						// Vendor general
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name: 'vendor',
							priority: 20,
							reuseExistingChunk: true,
						},
						// Chunk separado para admin
						admin: {
							test: /[\\/]app[\\/]admin[\\/]/,
							name: 'admin',
							priority: 30,
							reuseExistingChunk: true,
						},
						// Componentes comunes
						common: {
							minChunks: 2,
							priority: 10,
							reuseExistingChunk: true,
							name: 'common',
						},
					},
				},
			};
		}

		// ✅ Optimización de producción
		if (!dev) {
			config.optimization.minimize = true;
		}

		return config;
	},
	// ✅ Reduce el tamaño de las páginas
	compress: true,
	// ✅ Mejora el poder de caché
	poweredByHeader: false,
	// ✅ Optimiza la generación de páginas estáticas
	...(process.env.NODE_ENV === 'production' && {
		output: 'standalone',
	}),
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);

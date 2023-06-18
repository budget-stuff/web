import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		svgr(),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,html,jpg,png,svg}'],
				navigateFallbackDenylist: [/^\/api/]
			},
			manifest: {
				name: 'budget-stuff',
				short_name: 'bs',
				description: 'budget-stuff app',
				theme_color: '#ffffff',
				icons: [
					{
						src: 'pwa-144x144.png',
						sizes: '144x144',
						type: 'image/png'
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000/',
				changeOrigin: true
			}
		},
		cors: true,
		host: '0.0.0.0'
	}
});

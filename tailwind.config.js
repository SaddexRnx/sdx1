/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
			},
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				sans: ['Space Mono', 'monospace'],
				mono: ['Space Mono', 'monospace'],
				pixel: ['Press Start 2P', 'monospace'],
			},
			colors: {
				border: 'var(--border)',
				accent: {
					DEFAULT: 'var(--accent-primary)',
					hover: 'var(--accent-hover)',
					secondary: 'var(--accent-secondary)',
				},
				success: 'var(--success)',
				warning: 'var(--warning)',
				error: 'var(--error)',
				pixel: {
					black: '#000000',
					white: '#FFFFFF',
					gray: {
						100: '#F5F5F5',
						200: '#E0E0E0',
						300: '#C0C0C0',
						400: '#808080',
						500: '#404040',
						600: '#2A2A2A',
						700: '#1A1A1A',
					},
					green: '#00FF00',
					'green-dark': '#00CC00',
					blue: '#4A90E2',
				},
			},
			borderRadius: {
				pixel: '0px',
			},
			borderWidth: {
				pixel: '2px',
				'pixel-thick': '3px',
			},
			boxShadow: {
				'pixel-sm': 'var(--shadow-pixel-sm)',
				'pixel-md': 'var(--shadow-pixel-md)',
				'pixel-lg': 'var(--shadow-pixel-lg)',
				'pixel-xl': 'var(--shadow-pixel-xl)',
			},
			spacing: {
				'pixel': '8px',
				'pixel-2': '16px',
				'pixel-3': '24px',
				'pixel-4': '32px',
				'pixel-5': '40px',
				'pixel-6': '48px',
			},
			keyframes: {
				pixelPulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' },
				},
				pixelBlink: {
					'0%, 49%, 100%': { opacity: '1' },
					'50%, 99%': { opacity: '0' },
				},
				pixelSlideDown: {
					'0%': { transform: 'translateY(-8px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				pixelSpin: {
					'0%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(90deg)' },
					'50%': { transform: 'rotate(180deg)' },
					'75%': { transform: 'rotate(270deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				'pixel-pulse': 'pixelPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'pixel-blink': 'pixelBlink 1s step-end infinite',
				'pixel-slide': 'pixelSlideDown 150ms step-end',
				'pixel-spin': 'pixelSpin 1s step-end infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}

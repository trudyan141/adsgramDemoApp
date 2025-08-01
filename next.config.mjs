/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Add error handling for GitHub Pages
  basePath: process.env.GITHUB_ACTIONS ? '/adsgramDemoApp' : '',
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);

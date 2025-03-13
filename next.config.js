/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Enable styled-components
  compiler: {
    styledComponents: true
  }
};

module.exports = nextConfig;

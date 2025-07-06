/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    // Add any other domains you might need for images
  },
  // Server Actions are available by default now, no need for experimental flag
  // experimental: {
  //   serverActions: true,
  // },
  // Use the standard .next directory
  distDir: '.next',
};

module.exports = withPWA(nextConfig);
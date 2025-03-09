/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // 這告訴 webpack 在客戶端打包時忽略這些 Node.js 模塊
    config.resolve.fallback = {
      fs: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      stream: false,
      crypto: false,
      os: false,
    };
    return config;
  },
};

module.exports = nextConfig;

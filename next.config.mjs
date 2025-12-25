/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⚠️ temporary only
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

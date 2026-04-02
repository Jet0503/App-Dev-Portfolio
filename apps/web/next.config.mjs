/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  turbopack: {},
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

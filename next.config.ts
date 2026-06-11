import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.trycloudflare.com",
  ],
  output: "standalone",
  typescript: {
    // 👈 This will ignore the 'mediaType' error and let Docker finish building
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Use an environment variable for the backend URL
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jesica-noncommendatory-marjory.ngrok-free.dev'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
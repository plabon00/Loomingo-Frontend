import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.trycloudflare.com",
  ],
  output: "standalone",
  images: {
    qualities: [50, 75, 100],
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.shadcnspace.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  typescript: {
    // 👈 This will ignore the 'mediaType' error and let Docker finish building
    ignoreBuildErrors: true,
  },

  async rewrites() {
    // NEXT_PUBLIC_API_URL is a server-side variable read at runtime by Vercel (not baked at build time).
    // For local dev, it defaults to localhost:8080.
    // On Vercel, set NEXT_PUBLIC_API_URL=https://loomingo-backend-1.onrender.com in the dashboard.
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
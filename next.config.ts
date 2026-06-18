import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Microlink y otras fuentes externas usadas en el Journal
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

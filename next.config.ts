import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/portfolio/lumina-ecommerce",
        destination: "/portfolio/livira-fashion",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

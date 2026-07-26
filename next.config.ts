import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.pages.dev' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</.well-known/api-catalog>; rel="api-catalog", </.well-known/service-desc>; rel="service-desc", </.well-known/service-doc>; rel="service-doc", </llms.txt>; rel="describedby"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

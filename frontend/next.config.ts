import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Parse R2 public URL hostname for next/image
const r2Host = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // R2 bucket public domain (added dynamically from env)
      ...(r2Host
        ? [{ protocol: "https" as const, hostname: r2Host }]
        : []),
    ],
  },
};

export default withNextIntl(nextConfig);

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: { unoptimized: true },
  trailingSlash: true,
}

export default nextConfig

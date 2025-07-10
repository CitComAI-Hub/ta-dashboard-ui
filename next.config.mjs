/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  env: {
    NEXT_PUBLIC_TIL_API_URL: process.env.NEXT_PUBLIC_TIL_API_URL,
    NEXT_PUBLIC_TIR_API_URL: process.env.NEXT_PUBLIC_TIR_API_URL,
  },
}

export default nextConfig

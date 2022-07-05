/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
    NEXT_PUBLIC_CERAMIC_SEED: process.env.NEXT_PUBLIC_CERAMIC_SEED
  }
}

module.exports = nextConfig

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'image.tmdb.org',
      },
    ],
    unoptimized: true,
  },
  pageExtensions: ['mdx', 'ts', 'tsx'],
  transpilePackages: ['@plotwist/tmdb', '@plotwist/ui'],
}

module.exports = withMDX(nextConfig)

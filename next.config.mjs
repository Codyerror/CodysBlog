import { createContentlayerPlugin } from 'next-contentlayer'

const withContentlayer = createContentlayerPlugin()

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' }
    ]
  }
}

export default withContentlayer(nextConfig)

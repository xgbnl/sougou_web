import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/zh/dashboard',
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(en|zh)',
        destination: '/:lang/dashboard',
        permanent: true,
        locale: false
      },
      {
        source: '/:path((?!en|zh|front-pages|images|api|favicon.ico).*)*',
        destination: '/zh/:path*',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig

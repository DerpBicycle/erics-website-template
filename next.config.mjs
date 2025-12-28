/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-ready output
  output: 'standalone',

  // Enable instrumentation hook for server-side logging
  instrumentationHook: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy - adjust as needed for your app
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Supabase storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Add more remote patterns as needed
    ],
  },

  // Turbopack configuration
  turbopack: {
    root: process.cwd(),
  },

  // TypeScript and ESLint settings
  typescript: {
    // Set to true to ignore type errors during build (not recommended for production)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Set to true to ignore ESLint errors during build (not recommended for production)
    ignoreDuringBuilds: false,
  },
}

export default nextConfig

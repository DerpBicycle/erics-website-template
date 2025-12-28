import { type Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    default: 'Website Template',
    template: '%s | Website Template',
  },
  description: 'A modern Next.js website template with TypeScript and Tailwind CSS',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Website Template',
    description: 'A modern Next.js website template',
    siteName: 'Website Template',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Template',
    description: 'A modern Next.js website template',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inter font from rsms.me */}
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

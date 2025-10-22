import { type Metadata } from 'next'
import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: 'Website Template',
  description: 'A modern Next.js website template',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}

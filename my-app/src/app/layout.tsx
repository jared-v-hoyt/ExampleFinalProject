import NavigationBar from '@/components/NavigationBar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const pages = ['Products'];

export const metadata: Metadata = {
  title: 'Frontend Setup',
  description: 'A website demonstrating interaction between frontend and backend services.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationBar pages={pages} />
        {children}
      </body>
    </html>
  )
}

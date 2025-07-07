import 'leaflet/dist/leaflet.css'
import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
//import { supabase } from '../lib/supabaseClient'
import SupabaseUserSync from '../../components/SupabaseUserSync'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StartMB',
  description: 'Sell your home smarter, no agent needed.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-light text-dark font-sans ${inter.className}`}>
        <SupabaseUserSync />
        {children}
      </body>
    </html>
  )
}

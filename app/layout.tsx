import './css/style.css'

import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import NextToploader from 'nextjs-toploader'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import Router from 'next/router';
import AuthProvider from "@/components/Provider";




const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const aspekta = localFont({
  src: [
    {
      path: '../public/fonts/Aspekta-700.woff2',
      weight: '700',
    },       
  ],
  variable: '--font-aspekta',
  display: 'swap',  
})

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${aspekta.variable} font-inter antialiased bg-slate-900 text-slate-200 tracking-tight`}>
        <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
        <NextToploader
             
             color="#00B8F0"
             initialPosition={0.08}
             crawlSpeed={1500}
             height={4}
             crawl={true}
             showSpinner={false}
             easing="ease"
             speed={1500}
             shadow="0 0 10px #2299DD,0 0 5px #2299DD"
             template='<div class="bar" role="bar"><div class="peg"></div></div> 
             <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
             zIndex={1600}
             showAtBottom={false}
           />

            <AuthProvider>{children}</AuthProvider>

        </div>
      </body>
    </html>
  )
}

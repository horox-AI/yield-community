import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import react, { Component} from 'react'
import Router from 'next/router';
import NProgress from 'nprogress';
import NextToploader from 'nextjs-toploader'







export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
 
     <Header/>
      
      

             
      <main className="grow bg-body-bg">

        {children}

      </main>

      <Footer />
    </>
  )
}

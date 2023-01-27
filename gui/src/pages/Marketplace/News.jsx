import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function News() {
  return (
    <>
      <Head>
        <title>ANNA - Check latest news</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header currentPage={'Marketplace'} />
      <main className="grid h-screen bg-[url('../images/background/12.jpeg')] bg-cover">
        <div className="w-full bg-gray-700/80 py-60"></div>
      </main>
      <Footer />
    </>
  )
}

import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function Games() {
  return (
    <>
      <Head>
        <title>ANNA - DeFi made simple fun and simple</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header currentPage={'Games'} />
      <main className="min-h-screen">
        <div className="mt-60 flex justify-center">
          Comming soon in Spring 2023
        </div>
      </main>
      <Footer />
    </>
  )
}

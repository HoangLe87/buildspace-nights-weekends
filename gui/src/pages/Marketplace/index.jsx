import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export default function Marketplace() {
  return (
    <>
      <Head>
        <title>ANNA - DeFi made simple fun and simple</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header currentPage={'Marketplace'} />
      <main className="min-h-screen">
        <div className="mt-60 flex justify-center">
          Comming soon in Spring 2023
        </div>
      </main>
      <Footer />
    </>
  )
}

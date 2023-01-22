import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LPPools } from '@/components/defi/LPPools'
import { DexNavBar } from '@/components/defi/DexNavBar'

export default function Pools() {
  return (
    <>
      <Head>
        <title>ANNA - DeFi made simple fun and simple</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header currentPage={'DeFi'} />
      <main className="grid min-h-screen bg-[url('../images/background/8.jpeg')] bg-cover">
        <DexNavBar currentPage={'Pools'} />
        <LPPools />
      </main>
      <Footer />
    </>
  )
}

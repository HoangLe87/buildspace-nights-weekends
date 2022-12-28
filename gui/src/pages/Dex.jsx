import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Pools } from '@/components/Pools'
import { DexNavBar } from '@/components/DexNavBar'

export default function Dex() {
  return (
    <>
      <Head>
        <title>ANNA - DeFi made simple fun and simple</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header />
      <main>
        <DexNavBar />
        <Pools />
      </main>
      <Footer />
    </>
  )
}

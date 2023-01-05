import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { DexNavBar } from '@/components/DexNavBar'
import { SwapBox } from '@/components/SwapBox'
import { useFetchAllFirestoreData } from '@/utils/firestore'

export default function Swap() {
  const [pairs, setPairs] = useFetchAllFirestoreData('LiquidityPools')

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
      <main className="min-h-screen">
        <DexNavBar currentPage={'Swap'} />
        <SwapBox pairs={pairs} setPairs={setPairs} />
      </main>
      <Footer />
    </>
  )
}

import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { DexNavBar } from '@/components/defi/DexNavBar'
import { SwapBox } from '@/components/defi/SwapBox'
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
      <Header currentPage={'DeFi'} isGlowing={false} />
      <main className="grid h-screen bg-[url('../images/background/3.jpeg')] bg-cover">
        <DexNavBar currentPage={'Swap'} />
        <SwapBox pairs={pairs} setPairs={setPairs} />
      </main>
      <Footer />
    </>
  )
}

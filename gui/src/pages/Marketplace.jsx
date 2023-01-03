import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

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
      <Header />
      <main>
        <div className="flex justify-center">Comming soon in 2023</div>
      </main>
      <Footer />
    </>
  )
}

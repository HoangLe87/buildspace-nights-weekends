import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { TypeAnimation } from 'react-type-animation'

export default function Marketplace() {
  return (
    <>
      <Head>
        <title>ANNA - Marketplace trade assets P2P</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header currentPage={'Marketplace'} />
      <main className="grid h-screen bg-[url('../images/background/12.jpeg')] bg-cover">
        <div className="w-full bg-gray-700/80 py-60">
          <div className="mx-8 flex justify-center text-center align-middle text-slate-100">
            <TypeAnimation
              sequence={[
                "NFTs are the ultimate way to monetize and showcase your company's digital assets. They provide decentralised ",
                1000,
                'They provide true digital scarcity and authenticity.',
                1000,
                'Our in-house marketplace connects creators and collectors,',
                1000,
                'Our in-house marketplace provides a low cost P2P platform for buying and selling these',
                1000,
                'Our in-house marketplace provides a low cost P2P platform for buying and selling these unique aseets',
              ]}
              wrapper="div"
              cursor={true}
              style={{ fontSize: '2em' }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

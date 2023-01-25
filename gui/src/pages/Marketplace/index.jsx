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
                'Comming soon in spring 2023.',
                1000,
                'Comming soon in spring 2023. Please check our Roadmap on the Home page',
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

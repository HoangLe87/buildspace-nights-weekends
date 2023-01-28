import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import Card from '@/components/reusable/Card'
import img1 from '../../images/education/1.jpeg'
import img2 from '../../images/education/2.jpeg'
import img3 from '../../images/education/3.jpeg'

export default function School() {
  return (
    <>
      <Head>
        <title>ANNA - Education for everyone</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header currentPage={'Education'} />

      <main className="grid h-screen bg-[url('../images/background/13.jpeg')] bg-cover">
        <div className="z-1 absolute h-screen w-full bg-gray-900/80 "> </div>
        <div className="w-full bg-gray-700/80 py-60">
          <h1 className="mb-5 text-center text-3xl text-white">
            Get rewarded for studying new tech
          </h1>
          <div className="mx-8 grid grid-cols-3 justify-between text-center align-middle text-slate-100">
            <Card
              title1={'AI engineer'}
              title2={'Reward: 5 ANNA'}
              image={img1}
            />
            <Card
              title1={'Solidity auditor'}
              title2={'Reward: 5 ANNA'}
              image={img2}
            />
            <Card
              title1={'Web3 developer'}
              title2={'Reward: 5 ANNA'}
              image={img3}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

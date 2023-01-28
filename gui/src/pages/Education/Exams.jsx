import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import Card from '@/components/reusable/Card'
import img4 from '../../images/education/4.jpeg'
import img7 from '../../images/education/7.jpeg'
import img6 from '../../images/education/6.jpeg'

export default function School() {
  return (
    <>
      <Head>
        <title>ANNA - Test your skills</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header currentPage={'Education'} />

      <main className="grid min-h-screen bg-[url('../images/background/13.jpeg')] bg-cover">
        <div className="z-1 absolute h-full w-full bg-gray-700/80 py-60"> </div>
        <div className="w-full bg-gray-700/80 py-60">
          <h1 className="mb-5 text-center text-3xl text-white">
            Get rewarded for passing exams
          </h1>
          <div className="mx-8 grid grid-cols-3 justify-between text-center align-middle text-slate-100">
            <Card title1={'Solidity'} title2={'Reward: 2 ANNA'} image={img4} />
            <Card title1={'React'} title2={'Reward: 2 ANNA'} image={img7} />
            <Card title1={'Web2'} title2={'Reward: 2 ANNA'} image={img6} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

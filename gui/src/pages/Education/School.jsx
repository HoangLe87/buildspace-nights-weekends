import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import Card from '@/components/reusable/Card'

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
        <div className="w-full bg-gray-700/80 py-60">
          <div className="mx-8 flex justify-center text-center align-middle text-slate-100">
            <Card title1={'test'} title2={'test2'} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

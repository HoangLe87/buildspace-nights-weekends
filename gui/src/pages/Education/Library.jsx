import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { TypeAnimation } from 'react-type-animation'
import { EducationNavBar } from '@/components/layout/EducationNavBar'

export default function Library() {
  return (
    <>
      <Head>
        <title>ANNA - Marketplace trade assets P2P</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header currentPage={'Education'} />
      <main className="grid h-screen bg-[url('../images/background/16.jpeg')] bg-cover">
        <EducationNavBar currentPage={'Library'} />

        <div className=" flex  justify-center bg-gray-700/80 text-center align-middle text-slate-100">
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
      </main>
      <Footer />
    </>
  )
}

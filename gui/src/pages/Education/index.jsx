import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { TypeAnimation } from 'react-type-animation'
import { EducationNavBar } from '@/components/layout/EducationNavBar'

export default function Games() {
  return (
    <>
      <Head>
        <title>ANNA - DeFi made simple fun and simple</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header currentPage={'Education'} />
      <main className="grid h-screen bg-[url('../images/background/14.jpeg')] bg-cover">
        <EducationNavBar />

        <div className=" flex justify-center bg-gray-700/80 text-center align-middle text-slate-100">
          <TypeAnimation
            sequence={[
              'Blockchain technology is a revolutionizing',
              1000,
              'Blockchain technology is driving transformation and creating revenue streams',
              1000,
              'Develop your blockchain acumen through our education.',
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

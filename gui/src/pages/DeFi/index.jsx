import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { TypeAnimation } from 'react-type-animation'
import initializeFirebaseClient from '../../../firebase/firebaseConfig'
import { useState } from 'react'
import { DexNavBar } from '@/components/defi/DexNavBar'

export default function Home() {
  const { db, auth } = initializeFirebaseClient()
  const [isAnimated, setIsAnimated] = useState(false)

  return (
    <>
      <Head>
        <title>ANNA - Simple DeFi at your hand</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header currentPage={'DeFi'} />
      <main className="grid h-screen bg-[url('../images/background/11.jpeg')] bg-cover">
        <div className="w-full bg-gray-700/80 py-60 pr-5">
          <div className="flex justify-center px-8 text-center align-middle text-slate-100">
            <TypeAnimation
              sequence={[
                'Hello',
                1000,
                `Hello ${
                  auth.currentUser
                    ? auth.currentUser.email.split('@')[0]
                    : 'friend'
                }`,
                2000,
                'Welcome to this incredible journey to explore DeFi',
                2000,
                'Are you ready to embark?',
                2000,
                'Then make your choice',
                500,
                () => {
                  setIsAnimated(true)
                },
              ]}
              wrapper="div"
              cursor={true}
              style={{ fontSize: '2em' }}
            />
          </div>
          {isAnimated && <DexNavBar />}
        </div>
      </main>
      <Footer />
    </>
  )
}

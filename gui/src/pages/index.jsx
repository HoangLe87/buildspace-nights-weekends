import Head from 'next/head'

import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { MeetUs } from '@/components/MeetUs'
import { AnnaStats } from '@/components/AnnaStats'
import { Roadmap } from '@/components/Roadmap'

export default function Home() {
  return (
    <>
      <Head>
        <title>Win ANNA's heart</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header />
      <main>
        <Hero />
        <AnnaStats />
        <Services />
        <MeetUs />
        <CallToAction />
        <Faqs />
        <Roadmap />
      </main>
      <Footer />
    </>
  )
}

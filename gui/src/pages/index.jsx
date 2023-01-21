import Head from 'next/head'

import { CallToAction } from '@/components/home/CallToAction'
import { Faqs } from '@/components/home/Faqs'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/home/Hero'
import { Services } from '@/components/home/Services'
import { MeetUs } from '@/components/home/MeetUs'
import { AnnaStats } from '@/components/home/AnnaStats'
import { Roadmap } from '@/components/home/Roadmap'

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

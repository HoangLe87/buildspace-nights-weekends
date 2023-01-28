import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { EducationNavBar } from '@/components/layout/EducationNavBar'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function Newsroom() {
  const [trending, setTrending] = useState()
  const options = {
    method: 'GET',
    url: 'https://finance-social-sentiment-for-twitter-and-stocktwits.p.rapidapi.com/get-social-list',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': `${process.env.NEWS_API_KEY}`,
      'X-RapidAPI-Host': `${process.env.NEWS_API_HOST}`,
    },
  }

  const fetchAllNews = async () => {
    axios
      .request(options)
      .then(function (response) {
        setTrending({
          twitter: response.data.twitter,
          stocktwits: response.data.stocktwits,
          reddit: response.data.reddit,
        })
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  useEffect(() => {
    fetchAllNews()
  }, [])

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
      <main className="grid h-screen overflow-hidden bg-[url('../images/education/11.jpeg')] bg-cover">
        <EducationNavBar currentPage={'Newsroom'} />
        <div className=" mt-10 h-full overflow-auto bg-gray-700/80">
          <h1 className="mt-10 text-center text-3xl text-white">
            Tickers trending on socials
          </h1>
          <div className="flex justify-center gap-2 overflow-auto text-white">
            <div className="grid">
              <h1 className="text-xl">Twitter</h1>
              {trending && trending.twitter.map((i) => <div key={i}>{i}</div>)}
            </div>
            <div className="grid">
              <h1 className="text-xl">Stocktwits</h1>
              {trending &&
                trending.stocktwits.map((i) => <div key={i}>{i}</div>)}
            </div>
            <div className="grid">
              <h1 className="text-xl">Reddit</h1>
              {trending && trending.reddit.map((i) => <div key={i}>{i}</div>)}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

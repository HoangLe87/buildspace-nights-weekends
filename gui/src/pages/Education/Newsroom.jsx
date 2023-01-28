import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { TypeAnimation } from 'react-type-animation'
import { EducationNavBar } from '@/components/layout/EducationNavBar'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function Newsroom() {
  const [news, setNews] = useState()

  const options = {
    method: 'GET',
    url: 'https://pro-api.coingecko.com/api/v3/coins/markets',
    headers: {
      'X-RapidAPI-Key': '3e1eac0d6cmshae458c659b6ce51p191953jsndd77894067d7',
      'X-RapidAPI-Host': 'crypto-news-live3.p.rapidapi.com',
    },
  }

  const fetchAllNews = async () => {
    axios
      .request(options)
      .then(function (response) {
        console.log('respo', response.data)
        setNews(response.data)
        console.log('news', news)
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
      <main className="grid h-screen bg-[url('../images/education/11.jpeg')] bg-cover">
        <EducationNavBar currentPage={'Newsroom'} />

        <div className="flex  justify-center bg-gray-700/80 text-center align-middle text-slate-100">
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

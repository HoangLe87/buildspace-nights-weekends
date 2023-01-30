import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { EducationNavBar } from '@/components/layout/EducationNavBar'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaTwitterSquare } from 'react-icons/fa'
import { MdOutlineRequestPage } from 'react-icons/md'

export default function Newsroom() {
  const [trending, setTrending] = useState()
  const options = {
    method: 'GET',
    url: `https://api.coinstats.app/public/v1/coins?skip=0&limit=10&currency=USD`,
  }

  const fetchAllNews = async () => {
    axios
      .request(options)
      .then(function (response) {
        setTrending(response.data.coins)
        console.log('news', response.data.coins)
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
      <main className="grid min-h-screen overflow-hidden bg-[url('../images/education/11.jpeg')] bg-cover">
        <EducationNavBar currentPage={'Trending'} />

        <div className="m-auto mt-5 grid grid-cols-2 justify-center gap-4 overflow-hidden bg-gray-800/80  p-5 align-middle md:gap-8 lg:grid-cols-5">
          {trending?.map((i) => (
            <div
              key={i.id}
              className="flex w-full flex-col justify-center px-2 align-middle  text-xs text-white hover:cursor-pointer hover:text-slate-300"
            >
              <div className="flex justify-start gap-2 align-middle">
                <img src={i.icon} alt="icon" className="h-4 w-4" />
                <h1 className="text-xl">{i.symbol}</h1>
                <div className="flex justify-center gap-2">
                  <a className="hover:cursor-pointer" href={i.websiteUrl}>
                    <MdOutlineRequestPage />
                  </a>
                  <a className="hover:cursor-pointer" href={i.twitterUrl}>
                    <FaTwitterSquare />
                  </a>
                </div>
              </div>
              <div className="flex justify-start gap-2 align-middle">
                <div>Price: {i.price.toFixed(2)}</div>
                <div>
                  {i.priceChange1w > 0 ? (
                    <div className="text-green-500">
                      {i.priceChange1w.toFixed(2)}
                    </div>
                  ) : (
                    <div className="text-red-500">
                      {i.priceChange1w.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
              <div>Mcap: {(i.marketCap / 1000000000).toFixed(2)} b</div>
              <div>Vol: {(i.volume / 1000000000).toFixed(2)} b</div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

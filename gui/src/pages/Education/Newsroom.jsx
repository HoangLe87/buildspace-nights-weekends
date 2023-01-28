import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { EducationNavBar } from '@/components/layout/EducationNavBar'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Newsroom() {
  const [trending, setTrending] = useState()
  const [open, setOpen] = useState(false)
  const now = Date.now()
  const fifteenDaysAgo = now - 1296000000
  const options = {
    method: 'GET',
    url: `https://api.coinstats.app/public/v1/news?skip=0&limit=20&toDate=${now}&fromDate=${fifteenDaysAgo}`,
  }

  const fetchAllNews = async () => {
    axios
      .request(options)
      .then(function (response) {
        setTrending(response.data.news)
        console.log('news', response.data.news)
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
        <div className="mt-5 grid overflow-hidden bg-gray-800 p-5 align-middle">
          {trending?.map((i) => (
            <div
              key={i.id}
              href={i.link}
              className="flex w-full justify-center gap-4  px-2 text-white hover:cursor-pointer hover:text-slate-300"
            >
              <h1>{i.title}</h1>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

export const Card = (title, source, description, imgURL, feedDate) => {
  return (
    <>
      <div className="z-1 absolute bg-gray-700 text-white">
        <Image src={imgURL} width={200} height={200} alt="" />
        <h1>{title}</h1>
        <p>Description: {description}</p>
        <p>Source: {source}</p>
        <p>Updated: {new Date(feedDate)}</p>
      </div>
    </>
  )
}

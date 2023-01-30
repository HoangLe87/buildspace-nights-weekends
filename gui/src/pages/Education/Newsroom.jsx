import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { EducationNavBar } from '@/components/layout/EducationNavBar'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button } from '@/components/reusable/Button'

export default function Newsroom() {
  const [trending, setTrending] = useState()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState()
  const now = Date.now()
  const fifteenDaysAgo = now - 1296000000
  const options = {
    method: 'GET',
    url: `https://api.coinstats.app/public/v1/news?skip=0&limit=20&toDate=${now}&fromDate=${fifteenDaysAgo}`,
  }

  const expandNews = (id) => {
    setSelected(id)
    setOpen(!open)
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
  }, [open])

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
        <EducationNavBar currentPage={'Newsroom'} />
        <div className="mt-5 grid overflow-hidden bg-gray-800/80 p-5 align-middle">
          {trending?.map((i) => (
            <div
              key={i.id}
              href={i.link}
              onClick={() => {
                expandNews(i)
              }}
              className="grid w-full justify-start overflow-hidden px-2 text-white hover:cursor-pointer hover:text-slate-300"
            >
              <h1>{i.title}</h1>
            </div>
          ))}
        </div>
        {open && <Card selected={selected} setOpen={setOpen} />}
      </main>
      <Footer />
    </>
  )
}

export const Card = ({ selected, setOpen }) => {
  return (
    <>
      <div
        key={selected.id}
        className="z-1 mb-50 absolute mt-20 flex h-full w-full flex-col gap-5 bg-gray-800/90 p-5 text-white  backdrop-blur-sm"
      >
        <div className="flex justify-between">
          <h1>{selected.title}</h1>
          <button onClick={() => setOpen(false)}>x</button>
        </div>
        <div>{selected.description}</div>
        <div>Source: {selected.source}</div>
        <img src={selected.imgURL} alt="" />
        <div className=" text-center">
          <Button className="mr-4 h-10 w-20" onClick={() => setOpen(false)}>
            Close
          </Button>
          <a href={selected.link}>Read More</a>
        </div>
      </div>
    </>
  )
}

import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button } from '@/components/reusable/Button'
import { Formik, Form } from 'formik'

export default function CFD() {
  const [data, setData] = useState()
  const fetch = async () => {
    const allData = await axios.get('/api/binance')
    setData(allData.data)
  }

  useEffect(() => {
    fetch()
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
      <Header currentPage={'Marketplace'} />
      <main className="grid h-screen bg-[url('../images/background/12.jpeg')] bg-cover">
        <div className="w-full bg-gray-700/80 py-60">
          <div className="mx-8 flex justify-center text-center align-middle text-slate-100"></div>
          <h1 className="mb-10 text-center text-2xl text-white">
            {' '}
            Trade margin with ANNA{' '}
          </h1>
          {data?.map((i) => (
            <form
              key={i.symbol}
              className="mb-2 flex justify-center gap-2 text-center align-middle text-white"
            >
              {i.symbol} : {parseInt(i.price)}
              <input
                type="number"
                className="h-6 w-28 rounded-2xl bg-gray-800 text-center text-white "
              ></input>
              <Button className="h-6 w-20">Buy</Button>
              <Button className="h-6 w-20">Sell</Button>
            </form>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

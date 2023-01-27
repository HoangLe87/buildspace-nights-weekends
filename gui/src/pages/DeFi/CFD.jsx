import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button } from '@/components/reusable/Button'
import Chart from 'react-google-charts'
import initializeFirebaseClient from '../../../firebase/firebaseConfig'
import { useAddress } from '@thirdweb-dev/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DexNavBar } from '@/components/defi/DexNavBar'

export default function CFD() {
  const address = useAddress()

  const transact = async (e) => {
    const { db, auth } = initializeFirebaseClient()
    const user = auth.currentUser
    if (!address) {
      toast('Please connect your wallet')
    }
    if (!user) {
      toast('Please connect your wallet')
    }
    e.preventDefault()
    const token = await user.getIdToken()
    const response = await axios.post('/api/binance', {
      action: e.target.action.value,
      amount: e.target.amount.value,
      token: token,
    })
    alert(JSON.stringify(response.data))
  }

  const [data, setData] = useState()
  const getBinanceData = async () => {
    const allData = await axios.get('/api/binance')
    setData(allData.data)
  }
  const options = {
    legend: 'none',
    bar: { groupWidth: '100%' }, // Remove space between bars.
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
      risingColor: { strokeWidth: 0, fill: '#0f9d58' }, // green
    },
    backgroundColor: {
      stroke: 'none',
      fill: 'none',
    },
    hAxis: {
      textStyle: {
        color: 'white',
        fontSize: '10',
      },
    },
    vAxis: {
      textStyle: {
        color: 'white',
        fontSize: '10',
      },
    },
  }
  const [chartPrices, setChartPrices] = useState()
  const getChartPrices = async () => {
    const allData = await axios.get('/api/BTC')
    setChartPrices(allData.data)
  }
  useEffect(() => {
    getBinanceData()
    getChartPrices()
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
      <Header currentPage={'DeFi'} />
      <main className="grid h-screen bg-[url('../images/background/12.jpeg')] bg-cover">
        <DexNavBar currentPage={'CFD'} />
        <ToastContainer position="top-right" />
        <div className="mt-2 w-full bg-gray-700/80 pt-10">
          <div className="mx-8 flex justify-center text-center align-middle text-slate-100"></div>
          <h1 className="mb-10 text-center text-2xl text-white">
            {' '}
            Bet on the BTC direction with your ANNA holdings{' '}
          </h1>
          {data?.map((i) => (
            <form
              key={i.symbol}
              onSubmit={transact}
              className="mb-2 grid justify-center gap-2 text-center align-middle text-white sm:flex"
            >
              {i.symbol} : {parseInt(i.price)}
              <input
                id="amount"
                placeholder="0"
                className="h-6 w-28 rounded-2xl bg-gray-800 text-center text-white "
              />
              <select
                id="action"
                className="h-6 w-28 rounded-2xl bg-gray-800 text-center text-white "
              >
                <option value="buy" defaultValue={'Buy'}>
                  Buy
                </option>
                <option value="sell">Sell</option>
              </select>
              <Button type="submit" className="h-6 w-28">
                Transact
              </Button>
            </form>
          ))}

          <div className="container m-auto mt-5 flex w-screen justify-center text-center text-white">
            <Chart
              width={'100%'}
              height={450}
              chartType="CandlestickChart"
              loader={<div>Loading Chart</div>}
              data={chartPrices}
              options={options}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useContext, useEffect, useState } from 'react'
import { connectToContractUsingEthers } from '@/utils/metamask'
import { ethers } from 'ethers'
import { WalletContext } from './_app'
import Image from 'next/image'
import baby from '../images/profile/baby.png'
import logo from '../images/logos/logo.png'
import logo1 from '../images/logos/logo1.png'
import { Button } from '@/components/Button'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getAuth } from 'firebase/auth'

export default function Dashboard() {
  const auth = getAuth()
  const [currentAccount, setCurrentAccount, accountsStatic] =
    useContext(WalletContext)
  const [stats, setStats] = useState({
    annaBalance: '',
    loveBalance: '',
    stands: '',
    shops: '',
    stores: '',
    restaurants: '',
    hotels: '',
  })

  const getAnnaBalance = async () => {
    if (!window.ethereum) return
    if (!accountsStatic.anna.address || !accountsStatic.love.address) return
    try {
      const anna = await connectToContractUsingEthers(
        accountsStatic.anna.json,
        accountsStatic.anna.address
      )

      const annaBalance = ethers.utils.formatEther(
        String(await anna.balanceOf(currentAccount))
      )

      const love = await connectToContractUsingEthers(
        accountsStatic.love.json,
        accountsStatic.love.address
      )

      const loveBalance = ethers.utils.formatEther(
        String(await love.balanceOf(currentAccount))
      )

      const investments = await connectToContractUsingEthers(
        accountsStatic.investments.json,
        accountsStatic.investments.address
      )

      setStats({
        ...stats,
        annaBalance: annaBalance,
        loveBalance: loveBalance,
        stands: String(await investments.getTotalStakedPerPoolPerAdrl('0')),
        shops: String(await investments.getTotalStakedPerPoolPerAdrl('1')),
        stores: String(await investments.getTotalStakedPerPoolPerAdrl('2')),
        restaurants: String(
          await investments.getTotalStakedPerPoolPerAdrl('3')
        ),
        hotels: String(await investments.getTotalStakedPerPoolPerAdrl('4')),
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAnnaBalance()
  }, [stats.annaBalance, stats.loveBalance])

  const claim = () => {
    try {
      toast('Oops, insufficient LOVE tokens')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Head>
        <title>ANNA - DeFi made simple fun and simple</title>
        <meta
          name="description"
          content="A gamified DeFi protocol that lets the user claim ownership of the entire ecosystem"
        />
      </Head>
      <Header />
      <main className="min-h-screen bg-[url('../images/background/10.jpeg')] bg-cover">
        <ToastContainer position="top-right" />
        {auth.currentUser ? (
          <div className="w-full bg-gray-700/80 py-60 pr-5">
            <div className="flex justify-center gap-10 text-white">
              <div className="flex items-center gap-2">
                {stats.annaBalance | '0'}
                <Image src={logo} width={45} height={45} alt="" />
              </div>
              <div className="flex items-center gap-2">
                {stats.loveBalance | '0'}
                <Image src={logo1} width={50} height={50} alt="" />
              </div>
            </div>
            <div className="mt-10 grid place-items-center">
              <h1 className=" grid place-items-center  text-white">
                <span>Name: Baby</span>
                <span>Gender: boy</span>
                <span>Age: 1</span>
              </h1>
              <Image
                src={baby}
                width={500}
                height={500}
                alt="avatar"
                className="my-10 h-40 w-40 rounded-full"
                priority
              />
            </div>

            <div className="grid place-items-center  text-white">
              <div>Street food stands: {stats.stands | '0'}</div>
              <div>Urban coffee shops: {stats.shops | '0'}</div>
              <div>Fast food stores: {stats.stores | '0'}</div>
              <div>Michelin star restaurants: {stats.restaurants | '0'}</div>
              <div>Luxury 5-star hotels: {stats.hotels | '0'}</div>
            </div>
            <div className="mt-10 grid place-items-center">
              <Button onClick={() => claim()} color="gradient">
                Claim ownership
              </Button>
              <div className=" text-center text-white">
                (claim ownership of the entire ecosystem - 10k LOVE required)
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-gray-700/80 py-60 pr-5">
            <div className="flex h-full w-full items-center justify-center py-60 text-center font-bold text-white">
              Please sign in using the metamask "Sign In" button on the Homepage
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

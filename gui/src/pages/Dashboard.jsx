import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useContext, useEffect, useState } from 'react'
import { connectToContractUsingEthers } from '@/utils/metamask'
import { ethers } from 'ethers'
import { WalletContext } from './_app'
import Image from 'next/image'
import baby from '../images/profile/baby.png'
import logo from '../../public/favicon.png'
import logo1 from '../images/logos/profile.png'

export default function Dashboard() {
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
  console.log(currentAccount)
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
        stands: String(await investments.pools('0')),
        shops: String(await investments.pools('1')),
        stores: String(await investments.pools('2')),
        restaurants: String(await investments.pools('3')),
        hotels: String(await investments.pools('4')),
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAnnaBalance()
  }, [stats.annaBalance, stats.loveBalance])

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
      <main className="min-h-screen">
        <div className="m-2 flex justify-center gap-10">
          <div className="flex items-center gap-2">
            {stats.annaBalance | '0'}
            <Image src={logo1} width={75} height={75} alt="" />
          </div>
          <div className="flex items-center gap-2">
            {stats.loveBalance | '0'}
            <Image src={logo} width={50} height={50} alt="" />
          </div>
        </div>
        <div className="mt-10 grid place-items-center">
          <h1 className=" grid place-items-center">
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

        <div className="grid place-items-center">
          <div>Street food stands: {stats.stands | '0'}</div>
          <div>Urban coffee shops: {stats.shops | '0'}</div>
          <div>Fast food stores: {stats.stores | '0'}</div>
          <div>Michelin star restaurants: {stats.restaurants | '0'}</div>
          <div>Luxury 5-star hotels: {stats.hotels | '0'}</div>
        </div>
      </main>
      <Footer />
    </>
  )
}

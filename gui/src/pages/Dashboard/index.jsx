import Head from 'next/head'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { useContext, useEffect, useState } from 'react'
import { connectToContractUsingEthers } from '@/utils/metamask'
import { ethers } from 'ethers'
import { WalletContext } from '../_app'
import Image from 'next/image'
import baby from '../../images/profile/baby.png'
import logo from '../../images/logos/logo.png'
import logo1 from '../../images/logos/logo1.png'
import { Button } from '@/components/reusable/Button'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import initializeFirebaseClient from '../../../firebase/firebaseConfig'
import { useRouter } from 'next/router'
import { useAddress } from '@thirdweb-dev/react'

export default function Dashboard() {
  const router = useRouter()
  const address = useAddress()

  const { db, auth } = initializeFirebaseClient()

  if (!address || auth.currentUser) {
    router.push('/')
    return <div>Please log in first...</div>
  }
  const contractStatics = useContext(WalletContext)
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
    if (!contractStatics.anna.address || !contractStatics.love.address) return
    try {
      const anna = await connectToContractUsingEthers(
        contractStatics.anna.json,
        contractStatics.anna.address
      )

      const annaBalance = ethers.utils.formatEther(
        String(await anna.balanceOf(address))
      )

      const love = await connectToContractUsingEthers(
        contractStatics.love.json,
        contractStatics.love.address
      )

      const loveBalance = ethers.utils.formatEther(
        String(await love.balanceOf(address))
      )

      const investments = await connectToContractUsingEthers(
        contractStatics.investments.json,
        contractStatics.investments.address
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
  }, [])

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
      <Header currentPage={'Dashboard'} />
      <main className="min-h-screen bg-[url('../images/background/10.jpeg')] bg-cover">
        <ToastContainer position="top-right" />
        {auth.currentUser ? (
          <div className="w-full bg-gray-700/80 py-60 pr-5">
            <div className="flex justify-center gap-10 text-white">
              <div className="flex items-center gap-2">
                {stats.annaBalance | '0'}
                <Image src={logo} width={30} height={30} alt="" />
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
          <div className="flex min-h-screen w-screen items-center justify-between bg-gray-700/80 text-center font-bold text-white"></div>
        )}
      </main>
      <Footer />
    </>
  )
}

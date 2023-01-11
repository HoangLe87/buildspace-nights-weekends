import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { DexNavBar } from '@/components/DexNavBar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from '@/components/Button'
import { WalletContext } from './_app'
import { useContext } from 'react'
import { connectToContractUsingEthers } from '@/utils/metamask'
import { ethers } from 'ethers'

export default function Anna() {
  const [currentAccount, setCurrentAccount, accountsStatic] =
    useContext(WalletContext)
  const [buyAmount, setBuyAmount] = useState('')
  const [displayAmount, setDisplayAmount] = useState('')
  console.log(currentAccount)
  const calculateAmount = (e) => {
    setBuyAmount(e.target.value)
    if (e.target.value > 0) {
      setDisplayAmount(e.target.value * 0.1)
    }
  }

  const buy = async (e) => {
    e.preventDefault()
    try {
      if (!window.ethereum) {
        toast('Cannot do this without metamask.')
        return
      }

      const contract = await connectToContractUsingEthers(
        accountsStatic.anna.json,
        accountsStatic.anna.address
      )
      const result = await contract.buyAnna(
        ethers.utils.parseEther(String(buyAmount)),
        {
          value: ethers.utils.parseEther(String(displayAmount)),
        }
      )
      setBuyAmount('')
      setDisplayAmount('')
      if (result) toast(`transaction pending ${result.hash}`)
    } catch (error) {
      toast('Opps something went wrong')
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
      <main className="grid min-h-screen bg-[url('../images/background/4.jpeg')] bg-cover">
        <DexNavBar currentPage={'Anna'} />

        <div>
          <ToastContainer position="top-right" />

          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-gradient-to-br from-indigo-200 via-slate-600 to-indigo-200 px-4 pt-5 pb-4 text-left shadow-[0px_0px_10px_5px_#B794F4] transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <form onSubmit={(e) => buy(e)}>
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <div className="text-md mb-2 font-medium leading-6 text-white">
                      You can buy ANNA here
                    </div>
                    <div className="mb-2 rounded-xl border-2 border-solid border-green-500 bg-gradient-to-r from-green-400 to-cyan-500 text-sm font-bold">
                      <div className="text-white">You receive</div>
                      <div className="mt-2 flex justify-between">
                        <select
                          id="token1Symbol"
                          className="w-28 rounded-xl"
                          readOnly
                        >
                          <option value={'ANNA'}>{'ANNA'}</option>
                        </select>{' '}
                        <input
                          className="overflow-hidden rounded-xl p-0 text-center"
                          id="token1Amount"
                          name="token1Amount"
                          type="text"
                          minLength="0"
                          maxLength="30"
                          required
                          value={buyAmount}
                          onChange={(e) => calculateAmount(e)}
                        ></input>{' '}
                      </div>
                    </div>
                    <div className="rounded-xl border-2 border-solid border-red-400 bg-gradient-to-r from-red-400 to-purple-300 text-sm font-bold">
                      <div className=" text-white">You pay</div>
                      <div className="mt-2 flex justify-between">
                        <select
                          id="token2Symbol"
                          className="w-28 rounded-xl"
                          readOnly
                        >
                          <option value={'ETH'}>{'ETH'}</option>
                        </select>{' '}
                        <input
                          id="token2Amount"
                          className="overflow-hidden rounded-xl bg-gray-400 p-0 text-center"
                          type="text"
                          minLength="0"
                          maxLength="30"
                          required
                          value={displayAmount}
                          readOnly
                        ></input>{' '}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-center gap-3 sm:mt-6">
                  <Button type="submit" color="gradient" className="w-28">
                    Buy
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

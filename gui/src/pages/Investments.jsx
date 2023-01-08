import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { DexNavBar } from '@/components/DexNavBar'
import { WalletContext } from './_app'
import { useContext } from 'react'
import { connectToContractUsingEthers } from '@/utils/metamask'
import { ethers } from 'ethers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from '@/components/Button'

export default function Investments() {
  const [currentAccount, setCurrentAccount, accountsStatic] =
    useContext(WalletContext)

  const investments = [
    {
      id: [0],
      investment: 'Street food stand',
      apr: '10%',
      price: '1',
      info: 'low cost for low earnings',
    },
    {
      id: [1],
      investment: 'Urban coffee shop',
      apr: '25%',
      price: '10',
      info: 'moderate investment for moderate returns',
    },
    {
      id: [2],
      investment: 'Fast food store',
      apr: '50%',
      price: '100',
      info: 'the rich are now getting serious',
    },
    {
      id: [3],
      investment: 'Michelin restaurant',
      apr: '75%',
      price: '1000',
      info: 'only the elite can afford this',
    },
    {
      id: [4],
      investment: 'Luxury 5-star experience',
      apr: '100%',
      price: '10000',
      info: 'top earnings for the top Gs',
    },
  ]

  const buy = async (id) => {
    try {
      console.log('buying id', id)
      if (!window.ethereum) return
      const investmentContract = connectToContractUsingEthers(
        accountsStatic.investments.json,
        accountsStatic.investments.address
      )
      console.log('contract', investmentContract)
      console.log(await investmentContract.pools(id))
      //investmentContract.buyPool(id,'1')
    } catch (error) {
      toast(error)
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
      <main className="min-h-screen ">
        <DexNavBar currentPage={'Stake'} />

        <div className="my-60 px-4 sm:px-6 lg:px-8 ">
          <ToastContainer position="top-right" />
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">
                ANNA investments
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Buy the below with ANNA to start eaning ANNA. There is 50%
                selling tax so it makes only sense to leave these for long term.
                The longer you hold the more you earn.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Investment
                        </th>

                        <th
                          scope="col"
                          className="hidden py-3.5 pr-3  text-left text-sm font-semibold text-gray-900  sm:inline-block"
                        >
                          APR
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pr-3  text-left text-sm font-semibold text-gray-900 "
                        >
                          Price
                        </th>

                        <th
                          scope="col"
                          className="hidden py-3.5 pr-3  text-left text-sm font-semibold text-gray-900 sm:inline-block"
                        >
                          Info
                        </th>
                        <th
                          scope="col"
                          className="py-3.5  pr-3  text-left text-sm font-semibold text-gray-900"
                        >
                          Owned
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {investments.map((investment) => (
                        <tr key={investment.investment}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3  text-sm font-medium text-gray-900 sm:pl-6">
                            {`${investment.investment}`}
                          </td>
                          <td className="hidden whitespace-nowrap py-4 pr-3  text-sm text-gray-500 sm:inline-block">
                            {investment.apr}
                          </td>
                          <td className="whitespace-nowrap py-4 pr-3  text-sm text-gray-500">
                            {investment.price}
                          </td>
                          <td className="hidden whitespace-nowrap py-4 pr-3  text-sm text-gray-500 sm:inline-block">
                            {investment.info}
                          </td>
                          <td className="whitespace-nowrap py-4 pr-3 text-sm text-gray-500">
                            0
                          </td>

                          <td className="relative whitespace-nowrap py-4 pr-6 text-right text-sm font-medium">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() =>
                                window.ethereum
                                  ? buy(investment.id)
                                  : toast('Cannot do this without metamask!')
                              }
                            >
                              +
                            </a>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pr-6 text-right text-sm font-medium">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() =>
                                window.ethereum
                                  ? openWithdraw(
                                      investments.token1,
                                      investments.token2,
                                      investments.address
                                    )
                                  : toast('Cannot do this without metamask!')
                              }
                            >
                              -
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

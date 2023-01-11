import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { DexNavBar } from '@/components/DexNavBar'
import { WalletContext } from './_app'
import { useContext, useState, useEffect } from 'react'
import { connectToContractUsingEthers } from '@/utils/metamask'
import { ethers } from 'ethers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { _fetchData } from 'ethers/lib/utils'

export default function Investments() {
  const [currentAccount, setCurrentAccount, accountsStatic] =
    useContext(WalletContext)

  const [options, setOptions] = useState([
    {
      id: '0',
      investment: 'Street food stand',
      apr: '10%',
      price: 1,
      owned: '',
      earned: '',
    },
    {
      id: '1',
      investment: 'Urban coffee shop',
      apr: '25%',
      price: 10,
      owned: '',
      earned: '',
    },
    {
      id: '2',
      investment: 'Fast food store',
      apr: '50%',
      price: 100,
      owned: '',
      earned: '',
    },
    {
      id: '3',
      investment: 'Michelin star restaurant',
      apr: '75%',
      price: 1000,
      owned: '',
      earned: '',
    },
    {
      id: '4',
      investment: 'Luxury 5-star hotel',
      apr: '100%',
      price: 10000,
      owned: '',
      earned: '',
    },
  ])

  const buy = async (id) => {
    try {
      if (!window.ethereum) return

      const annaContract = await connectToContractUsingEthers(
        // connect to the selltoken
        accountsStatic.anna.json,
        accountsStatic.anna.address
      )

      await annaContract.approve(
        accountsStatic.investments.address,
        ethers.utils.parseEther(String(options[id].price))
      )

      const investmentContract = await connectToContractUsingEthers(
        accountsStatic.investments.json,
        accountsStatic.investments.address
      )

      const result = await investmentContract.buyPool(id, '1')

      if (result) toast(`transaction pending ${result.hash}`)
    } catch (error) {
      toast(error)
    }
  }

  const sell = async (id) => {
    try {
      if (!window.ethereum) return
      const investmentContract = await connectToContractUsingEthers(
        accountsStatic.investments.json,
        accountsStatic.investments.address
      )
      const result = await investmentContract.sellPool(id, 1)
      if (result) toast(`transaction pending ${result.hash}`)
    } catch (error) {
      toast(error)
    }
  }

  const claim = async (id) => {
    try {
      if (!window.ethereum) return
      const investmentContract = await connectToContractUsingEthers(
        accountsStatic.investments.json,
        accountsStatic.investments.address
      )

      const result = await investmentContract.claim(id)
      if (result) toast(`transaction pending ${result.hash}`)
    } catch (error) {
      toast(error)
    }
  }

  const fetchData = async () => {
    if (!window.ethereum) return
    let data = []
    try {
      const investmentContract = await connectToContractUsingEthers(
        accountsStatic.investments.json,
        accountsStatic.investments.address
      )

      for (let i = 0; i < options.length; i++) {
        data.push({
          earned: ethers.utils.formatEther(
            await investmentContract.getTotalEarnedPerPoolPerAdrl(i)
          ),
          staked: String(
            await investmentContract.getTotalStakedPerPoolPerAdrl(i)
          ),
        })
      }

      setOptions([
        {
          ...options[0],
          owned: data[0].staked,
          earned: data[0].earned,
        },
        {
          ...options[1],
          owned: data[1].staked,
          earned: data[1].earned,
        },
        {
          ...options[2],
          owned: data[2].staked,
          earned: data[2].earned,
        },
        {
          ...options[3],
          owned: data[3].staked,
          earned: data[3].earned,
        },
        {
          ...options[4],
          owned: data[4].staked,
          earned: data[4].earned,
        },
      ])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
      <main className="grid h-screen w-screen bg-[url('../images/background/9.jpeg')] bg-cover">
        <DexNavBar currentPage={'Investments'} />
        <div className="px-4 sm:px-6 lg:px-8 ">
          <ToastContainer position="top-right" />
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-white">
                ANNA investments
              </h1>
              <p className="mt-2 text-sm text-white">
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
                    <thead className="w-full bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className=" py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Investment
                        </th>

                        <th
                          scope="col"
                          className="mr-3 hidden py-3.5  text-left text-sm font-semibold text-gray-900  sm:table-cell"
                        >
                          APR
                        </th>
                        <th
                          scope="col"
                          className="mr-3 hidden py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell "
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="mr-3 hidden py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                          Owned
                        </th>
                        <th
                          scope="col"
                          className="mr-3 hidden py-3.5  text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                          Earned
                        </th>
                        <th
                          scope="col"
                          className=" py-3.5 pr-3  text-left text-sm font-semibold text-gray-900 "
                        ></th>
                        <th
                          scope="col"
                          className=" py-3.5 pr-3  text-left text-sm font-semibold text-gray-900 "
                        ></th>
                        <th
                          scope="col"
                          className=" py-3.5 pr-3  text-left text-sm font-semibold text-gray-900 "
                        ></th>
                      </tr>
                    </thead>
                    <tbody className=" divide-y divide-gray-200 bg-white">
                      {options.map((option) => (
                        <tr key={option.id}>
                          <td className=" whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {`${option.investment}`}
                          </td>
                          <td className="mr-3 hidden whitespace-nowrap py-4 text-sm text-gray-500 sm:table-cell">
                            {option.apr}
                          </td>
                          <td className="mr-3 hidden whitespace-nowrap py-4 text-sm  text-gray-500 sm:table-cell">
                            {new Intl.NumberFormat().format(option.price)}
                          </td>
                          <td className="mr-3 hidden whitespace-nowrap py-4 text-sm text-gray-500 sm:table-cell">
                            {option.owned | 0}
                          </td>
                          <td className=" mr-3 hidden whitespace-nowrap py-4 text-sm text-gray-500 sm:table-cell">
                            {option.earned | 0}
                          </td>
                          <td className=" whitespace-nowrap py-4 pr-6 text-right text-sm font-medium">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() =>
                                window.ethereum
                                  ? claim(option.id)
                                  : toast('Cannot do this without metamask!')
                              }
                            >
                              Claim
                            </a>
                          </td>

                          <td className=" whitespace-nowrap py-4 pr-6 text-right text-sm font-medium">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() =>
                                window.ethereum
                                  ? buy(option.id)
                                  : toast('Cannot do this without metamask!')
                              }
                            >
                              +
                            </a>
                          </td>
                          <td className=" whitespace-nowrap py-4 pr-6 text-right text-sm font-medium">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() =>
                                window.ethereum
                                  ? sell(option.id)
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

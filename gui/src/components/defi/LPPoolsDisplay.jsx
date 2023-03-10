import { useContext, useState } from 'react'
import { PoolDetailsContext } from './LPPools'
import { LPPoolDeposit } from './LPPoolDeposit'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LPPoolWithdraw } from './LPPoolWithdraw'

export function LPPoolsDisplay() {
  const [
    isCreatePoolBoxOpen,
    setCreatePoolBoxOpen,
    pairs,
    setPairs,
    abi,
    EXCHANGE_FACTORY,
    isDepositBoxOpen,
    setDepositBoxOpen,
    isWithdrawBoxOpen,
    setWithdrawBoxOpen,
  ] = useContext(PoolDetailsContext)

  const [selectedPair, setSelectedPair] = useState({
    token1: '',
    token2: '',
    address: '',
  })

  const openWithdraw = (token1, token2, address) => {
    setSelectedPair({
      token1: token1,
      token2: token2,
      address: address,
    })
    setWithdrawBoxOpen(true)
  }

  const openDeposit = (token1, token2, address) => {
    setSelectedPair({
      token1: token1,
      token2: token2,
      address: address,
    })
    setDepositBoxOpen(true)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" />
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-white">Liquidity pools</h1>
          <p className="mt-2 text-sm text-white">
            Earn DEX trading fees by providing liquidity. No hidden costs or
            charges!
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => setCreatePoolBoxOpen(!isCreatePoolBoxOpen)}
          >
            Create a new pool
          </button>
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
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Pair
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Fee
                    </th>

                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    ></th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {pairs.map((pair) => (
                    <tr key={pair.pair}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {`${pair.token1}-${pair.token2}`}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {pair.fee}
                      </td>

                      <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() =>
                            window.ethereum
                              ? openDeposit(
                                  pair.token1,
                                  pair.token2,
                                  pair.address
                                )
                              : toast('Cannot do this without metamask!')
                          }
                        >
                          Deposit
                        </a>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pr-2 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() =>
                            window.ethereum
                              ? openWithdraw(
                                  pair.token1,
                                  pair.token2,
                                  pair.address
                                )
                              : toast('Cannot do this without metamask!')
                          }
                        >
                          Withdraw
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
      {isWithdrawBoxOpen && (
        <LPPoolWithdraw
          token1={selectedPair.token1}
          token2={selectedPair.token2}
          exchangeAddress={selectedPair.address}
        />
      )}
      {isDepositBoxOpen && (
        <LPPoolDeposit
          token1={selectedPair.token1}
          token2={selectedPair.token2}
          exchangeAddress={selectedPair.address}
        />
      )}
    </div>
  )
}

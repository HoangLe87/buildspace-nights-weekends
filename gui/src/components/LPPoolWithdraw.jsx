import { Fragment, useState, useContext } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PoolDetailsContext } from './LPPools'
import { connectToContractUsingEthers } from '@/utils/metamask'
import exchangeABI from '../../public/static/ex.json'
import erc20ABI from '../../public/static/erc20.json'
import { WalletContext } from '../pages/_app'
import { Button } from './Button'
import { ethers } from 'ethers'

export function LPPoolWithdraw({ token1, token2, exchangeAddress }) {
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

  const [userLpBalance, setUserLpBalance] = useState('')
  const [currentAccount, setCurrentAccount] = useContext(WalletContext)

  const getMaxLp = async (e) => {
    try {
      if (typeof window == 'undefined') return
      if (window.ethereum) {
        const erc20lp = await connectToContractUsingEthers(
          erc20ABI,
          exchangeAddress
        )

        let userLpBalance = ethers.utils.formatEther(
          await erc20lp.balanceOf(currentAccount)
        )
        setUserLpBalance(userLpBalance)
      }
    } catch (error) {
      toast(error)
    }
  }

  // close the input box
  const closeModal = () => {
    setUserLpBalance('')
    setWithdrawBoxOpen(false)
  }

  const withdrawLp = async () => {
    try {
      if (!window.ethereum) {
        toast('Cannot do this without metamask.')
        return
      }

      // connect to exchange contract
      const exchangeContract = await connectToContractUsingEthers(
        exchangeABI,
        exchangeAddress
      )
      const result = await exchangeContract.rem(
        ethers.utils.parseEther(userLpBalance)
      )

      if (result) {
        toast(`Hash: ${result.hash}`)
      }

      setWithdrawBoxOpen(false)
    } catch (error) {
      toast(`Uups, something went wrong.`)
    }
  }

  return (
    <>
      {window.ethereum && (
        <Transition.Root show={true} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => {}}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <ToastContainer position="top-right" />
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Withdraw liquidity
                        </Dialog.Title>
                        <div className="mt-2">
                          <Button color="blue" onClick={(e) => getMaxLp(e)}>
                            <span className="w-12 max-w-xs overflow-hidden px-1">
                              Max
                            </span>{' '}
                          </Button>
                          <input
                            id="lpTokens"
                            type="number"
                            minLength="0"
                            maxLength="30"
                            className="text-center"
                            required
                            value={userLpBalance || 0}
                            onChange={(e) => setUserLpBalance(e.target.value)}
                          ></input>{' '}
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center gap-3 sm:mt-6">
                      <button
                        type="button"
                        className="inline-flex w-1/3 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={() => closeModal()}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="inline-flex w-1/3 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={() => withdrawLp()}
                      >
                        Withdraw
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </>
  )
}

import { Fragment, useState, useContext } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PoolDetailsContext } from './LPPools'
import { connectToContractUsingEthers } from '@/utils/metamask'
import exchangeABI from '../../public/static/ex.json'
import erc20ABI from '../../public/static/erc20.json'
import { ethers } from 'ethers'

export function LPPoolDeposit({ token1, token2, exchangeAddress }) {
  const [
    isCreatePoolBoxOpen,
    setCreatePoolBoxOpen,
    pairs,
    setPairs,
    exFacJson,
    EXCHANGE_FACTORY,
    isDepositBoxOpen,
    setDepositBoxOpen,
    isWithdrawBoxOpen,
    setWithdrawBoxOpen,
  ] = useContext(PoolDetailsContext)

  const [inputToken, setInputToken] = useState({
    inputTokenSymbol: token1,
    inputTokenAmount: 0,
  })

  const [requiredToken, setRequiredToken] = useState({
    requiredTokenSymbol: token2,
    requiredTokenAmount: 0,
    lpTokensToReceive: '',
  })

  const getEstimateToken = async (e) => {
    setInputToken({ ...inputToken, inputTokenAmount: e.target.value })

    try {
      if (typeof window == 'undefined') return
      if (window.ethereum && e.target.value > 0) {
        const exchangeContract = await connectToContractUsingEthers(
          exchangeABI,
          exchangeAddress
        )
        let data = await exchangeContract.getEst(
          inputToken.inputTokenSymbol,
          e.target.value
        )
        let tokenSymbol = String(data).split(',')[0]
        let tokenEstimate = ethers.utils.formatEther(data.split(',')[1])
        let lpTokens = ethers.utils.formatEther(data.split(',')[2])

        setRequiredToken({
          requiredTokenSymbol: tokenSymbol,
          requiredTokenAmount: tokenEstimate,
          lpTokensToReceive: lpTokens,
        })
      }
    } catch (error) {
      toast(error)
    }
  }

  const toggleToken = (e) => {
    try {
      if (e.target.value == token1) {
        setInputToken({ ...inputToken, inputTokenSymbol: token1 })
        setRequiredToken({ ...requiredToken, requiredTokenSymbol: token2 })
      } else {
        setInputToken({ ...inputToken, inputTokenSymbol: token2 })
        setRequiredToken({ ...requiredToken, requiredTokenSymbol: token1 })
      }
    } catch (error) {
      toast(error)
    }
  }

  // close the input box
  const closeModal = () => {
    setInputToken({
      inputTokenSymbol: token1,
      inputTokenAmount: '',
    })
    setRequiredToken({
      requiredTokenSymbol: token2,
      requiredTokenAmount: '',
      lpTokensToReceive: '',
    })
    setDepositBoxOpen(false)
  }

  const depositLP = async () => {
    try {
      if (!window.ethereum) {
        toast('Cannot do this without metamask.')
        return
      }
      // connect to factory
      const exchangeFactory = await connectToContractUsingEthers(
        exFacJson,
        EXCHANGE_FACTORY
      )
      // get addresses of the 2 ERC20 tokens
      const inputAdr = await exchangeFactory.symbAdr(
        inputToken.inputTokenSymbol
      )
      const requiredAdr = await exchangeFactory.symbAdr(
        requiredToken.requiredTokenSymbol
      )
      // connecting to the input ERC20 token
      const erc20input = await connectToContractUsingEthers(erc20ABI, inputAdr)
      await erc20input.approve(exchangeAddress, inputToken.inputTokenAmount)

      // connecting to the required ERC20 token
      const erc20required = await connectToContractUsingEthers(
        erc20ABI,
        requiredAdr
      )
      await erc20required.approve(
        exchangeAddress,
        ethers.parseEther(requiredToken.requiredTokenAmount)
      )

      // connect to exchange contract

      const exchangeContract = await connectToContractUsingEthers(
        exchangeABI,
        exchangeAddress
      )

      const result = await exchangeContract.add(
        inputToken.inputTokenSymbol,
        ethers.parseEther(inputToken.inputTokenAmount)
      )

      if (result) {
        toast(`Hash: ${result.hash}`)
      }

      setCreatePoolBoxOpen(false)
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
                          Deposit liquidity
                        </Dialog.Title>
                        <div className="mt-2 flex justify-center">
                          <select
                            onChange={(e) => toggleToken(e)}
                            id="token1Symbol"
                            className="w-28 rounded-xl"
                          >
                            <option value={token1} defaultValue>
                              {token1}
                            </option>
                            <option value={token2}>{token2}</option>
                          </select>{' '}
                          <input
                            id="token1Amount"
                            type="number"
                            minLength="0"
                            maxLength="30"
                            className="overflow-hidden rounded-xl p-0 text-center"
                            required
                            value={inputToken.inputTokenAmount}
                            onChange={(e) => getEstimateToken(e)}
                          ></input>{' '}
                        </div>
                        <div className="mt-2 flex justify-center">
                          <select id="token2Symbol" className="w-28 rounded-xl">
                            <option value={requiredToken.requiredTokenSymbol}>
                              {requiredToken.requiredTokenSymbol}
                            </option>
                          </select>{' '}
                          <input
                            id="token2Amount"
                            type="number"
                            minLength="0"
                            maxLength="30"
                            className="overflow-hidden rounded-xl bg-gray-400 p-0 text-center"
                            value={requiredToken.requiredTokenAmount}
                            readOnly
                          ></input>{' '}
                        </div>

                        <div className="mt-2">
                          Total lp tokens to be recieved:{' '}
                          {requiredToken.lpTokensToReceive}
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
                        onClick={() => depositLP()}
                      >
                        Deposit
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

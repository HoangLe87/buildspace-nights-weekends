import { Fragment, useState, useContext } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PoolDetailsContext } from './LPPools'
import { connectToContractUsingEthers } from '@/utils/metamask'

export function LPPoolCreate() {
  const [
    isCreatePoolBoxOpen,
    setCreatePoolBoxOpen,
    pairs,
    setPairs,
    abi,
    EXCHANGE_FACTORY,
  ] = useContext(PoolDetailsContext)
  const [input, setInput] = useState({
    token1: '',
    token1Address: '',
    token2: '',
    token2Address: '',
  })

  const addPool = async () => {
    try {
      if (!window.ethereum) {
        toast('Cannot do this without metamask.')
        return
      }
      const connectedContract = await connectToContractUsingEthers(
        abi,
        EXCHANGE_FACTORY
      )
      const result = await connectedContract.createExchangeBySymbol(
        input.token1,
        input.token1Address,
        input.token2,
        input.token2Address
      )
      if (result) {
        toast(`Hash: ${result.hash}`)
      }
      setInput({
        token1: '',
        token1Address: '',
        token2: '',
        token2Address: '',
      })
      setCreatePoolBoxOpen(false)
    } catch (error) {
      toast(`Uups, somthing went wrong.`)
    }
  }

  return (
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
                      Create a pool
                    </Dialog.Title>
                    <div className="mt-2">
                      <input
                        id="token1Symbol"
                        type="text"
                        placeholder="ANNA"
                        minLength="3"
                        maxLength="6"
                        required
                        value={input.token1}
                        onChange={(e) =>
                          setInput({ ...input, token1: e.target.value })
                        }
                      ></input>{' '}
                      <input
                        id="token1Address"
                        type="text"
                        placeholder="0x..."
                        minLength="42"
                        maxLength="42"
                        required
                        value={input.token1Address}
                        onChange={(e) =>
                          setInput({ ...input, token1Address: e.target.value })
                        }
                      ></input>
                    </div>
                    <div className="mt-2">
                      <input
                        id="token2Symbol"
                        type="text"
                        placeholder="ETH"
                        minLength="3"
                        maxLength="6"
                        required
                        value={input.token2}
                        onChange={(e) =>
                          setInput({ ...input, token2: e.target.value })
                        }
                      ></input>{' '}
                      <input
                        id="token2Address"
                        type="text"
                        placeholder="0x..."
                        minLength="42"
                        maxLength="42"
                        required
                        value={input.token2Address}
                        onChange={(e) =>
                          setInput({ ...input, token2Address: e.target.value })
                        }
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-center gap-3 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-1/3 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => setCreatePoolBoxOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-1/3 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => addPool()}
                  >
                    Create
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

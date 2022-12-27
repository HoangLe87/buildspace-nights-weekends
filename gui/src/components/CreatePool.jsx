import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ethers } from 'ethers'
import abi from '../../public/static/exchangeFactory.json'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function CreatePool({ setIsLoaded, isLoaded }) {
  const EXCHANGE_FACTORY = '0xDBBB9ad31b0bf8Ab53a54Da6f62b10F7b4b1240e'
  const [open, setOpen] = useState(true)
  const [input, setInput] = useState({
    token1: '',
    token1Address: '',
    token2: '',
    token2Address: '',
  })

  const { ethereum } = window
  if (ethereum) {
  }

  const submitDataToFireStore = async () => {
    // Add a new document in collection "cities"
    await setDoc(doc(db, 'LiquidityPools', `${input.token2}${input.token1}`), {
      pair: `${input.token1}${input.token2}`,
      token1: input.token1,
      token1Address: input.token1Address,
      token2: input.token2,
      token2Address: input.token2Address,
    })
  }

  const addPool = async (e) => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        return
      }
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const connectedContract = new ethers.Contract(
        EXCHANGE_FACTORY,
        abi.abi,
        signer
      )
      const result = await connectedContract.createExchangeBySymbol(
        input.token1,
        input.token1Address,
        input.token2,
        input.token2Address
      )
      if (result) toast('Pending...: ', result.hash)
      console.log('result: ', result)
      await submitDataToFireStore()
      setInput({
        token1: '',
        token1Address: '',
        token2: '',
        token2Address: '',
      })
      setOpen(false)
    } catch (error) {
      console.log(error)
      toast.error('Upps, someting went wrong')
    }
  }

  useEffect(() => {
    let connectedContract
    const onExchangeCreated = async (exchangeAddress, t1, t2, timestamp) => {
      console.log('ExchangeCreated', exchangeAddress, t1, t2)
    }
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const connectedContract = new ethers.Contract(
        EXCHANGE_FACTORY,
        abi.abi,
        signer
      )
      setIsLoaded(!isLoaded)
      connectedContract.on('ExchangeCreated', onExchangeCreated)
    }
    return () => {
      if (connectedContract) {
        connectedContract.off('ExchangeCreated', onExchangeCreated)
      }
    }
  }, [])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                    onClick={() => setOpen(false)}
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

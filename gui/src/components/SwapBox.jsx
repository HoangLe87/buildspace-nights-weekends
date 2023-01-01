import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'

export function SwapBox({ pairs, setPairs }) {
  let result = pairs.map((pair) => pair.token2).concat('ANNA')
  const [tokens, setTokens] = useState({
    unique: result,
    tokenBuy: result,
    tokenSell: result,
  })

  const toggleToken1 = (e) => {
    setTokens({
      ...tokens,
      tokenBuy: tokens.unique.filter((token) => token != e.target.value),
    })
  }
  const toggleToken2 = (e) => {
    setTokens({
      ...tokens,
      tokenSell: tokens.unique.filter((token) => token != e.target.value),
    })
  }
  console.log(tokens.tokenBuy)
  return (
    <div>
      <ToastContainer position="top-right" />

      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-gray-500 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <div className="text-md mb-2 font-medium leading-6 text-white">
                Instant trades with low fees
              </div>
              <div className="mb-2 border-2 border-solid border-green-500 bg-green-500 text-sm font-bold">
                <div className="text-white">Buy</div>
                <div className="mt-2 flex">
                  <select
                    id="token2Symbol"
                    className="w-28"
                    onChange={(e) => toggleToken2(e)}
                  >
                    {tokens.tokenBuy.map((token) => (
                      <option key={token} value={token}>
                        {token}
                      </option>
                    ))}
                  </select>{' '}
                  <input
                    id="token1Amount"
                    type="number"
                    minLength="0"
                    maxLength="30"
                    required
                    value={1}
                    onChange={(e) => {}}
                  ></input>{' '}
                </div>
              </div>
              <div className="border-2 border-solid border-red-500 bg-red-500 text-sm font-bold">
                <div className=" text-white">Sell</div>
                <div className="mt-2 flex">
                  <select
                    id="token2Symbol"
                    className="w-28"
                    onChange={(e) => toggleToken1(e)}
                  >
                    {tokens.tokenSell.map((token) => (
                      <option key={token} value={token}>
                        {token}
                      </option>
                    ))}
                  </select>{' '}
                  <input
                    id="token1Amount"
                    type="number"
                    minLength="0"
                    maxLength="30"
                    required
                    value={2}
                    onChange={(e) => {}}
                  ></input>{' '}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center gap-3 sm:mt-6">
            <button
              type="button"
              className="inline-flex w-1/3 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              onClick={() => {}}
            >
              Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import exchangeABI from '../../public/static/ex.json'
import erc20ABI from '../../public/static/erc20.json'
import { connectToContractUsingEthers } from '@/utils/metamask'
import { Button } from './Button'
import { ethers } from 'ethers'

export function SwapBox({ pairs, setPairs }) {
  let result = pairs.map((pair) => pair.token2).concat('ANNA')
  const [tokens, setTokens] = useState({
    unique: result,
    tokenBuy: result,
    tokenBuyAmount: '',
    tokenSell: result,
    tokenSellAmount: '',
  })
  const [estimate, setEstimate] = useState({
    buyToken: 'ANNA',
    buyAmount: 0,
    sellToken: 'ANNA',
    sellAmount: '',
  })

  const toggleToken1 = (e) => {
    setTokens({
      ...tokens,
      tokenSell: tokens.unique.filter((token) => token != e.target.value),
    })
    setEstimate({
      ...estimate,
      buyToken: e.target.value,
    })
  }

  const toggleToken2 = (e) => {
    setTokens({
      ...tokens,
      tokenBuy: tokens.unique.filter((token) => token != e.target.value),
    })
    setEstimate({
      ...estimate,
      sellToken: e.target.value,
    })
  }

  useEffect(() => {
    setTokens({
      unique: result,
      tokenBuy: result,
      tokenSell: result,
    })
  }, [pairs])

  const getEstimate = async (e) => {
    setTokens({
      ...tokens,
      tokenSellAmount: e.target.value,
    })
    if (e.target.value <= 0) return
    let buyToken = estimate.buyToken
    let sellToken = estimate.sellToken
    let sellAmount = e.target.value
    const tokensList = pairs.map((pair) => pair.token2)
    try {
      if (!window.ethereum) {
        toast('Cannot do this without metamask.')
        return
      }
      // if ANNA is one of the swap tokens
      if (
        (buyToken === 'ANNA' || sellToken === 'ANNA') &&
        (buyToken !== 'ANNA' || sellToken !== 'ANNA')
      ) {
        let index = ''
        // buy ANNA with XXX
        if (buyToken === 'ANNA') {
          index = tokensList.indexOf(sellToken)

          // sell ANNA with XXX
        } else {
          index = tokensList.indexOf(buyToken) // find the pair
        }
        //transact
        const exAddress = pairs[index].address // find exchange address

        const exchange = await connectToContractUsingEthers(
          // connect to the exchange
          exchangeABI,
          exAddress
        )
        const buyTokenAmount = ethers.utils.formatEther(
          String(
            await exchange.sellEst(
              sellToken,
              ethers.utils.parseEther(sellAmount)
            )
          ).split(',')[1]
        ) // get ANNA est
        setEstimate({
          ...estimate,
          buyAmount: buyTokenAmount,
        })

        // buy XXX and sell ZZZ
      } else if (buyToken !== 'ANNA' && sellToken !== 'ANNA') {
        // sell ZZZ buy ANNA
        const sellIndex = tokensList.indexOf(sellToken)
        const sellAddress = pairs[sellIndex].address
        const exchange1 = await connectToContractUsingEthers(
          exchangeABI,
          sellAddress
        )
        const annaAmount = ethers.utils.formatEther(
          String(
            await exchange1.sellEst(
              sellToken,
              ethers.utils.parseEther(sellAmount)
            )
          ).split(',')[1]
        )
        // sell ANNA buy XXX
        const buyIndex = tokensList.indexOf(buyToken)
        const buyAddress = pairs[buyIndex].address
        const exchange2 = await connectToContractUsingEthers(
          exchangeABI,
          buyAddress
        )
        const buyTokenAmount = ethers.utils.formatEther(
          String(
            await exchange2.sellEst('ANNA', ethers.utils.parseEther(annaAmount))
          ).split(',')[1]
        )
        setEstimate({
          ...estimate,
          buyAmount: buyTokenAmount,
        })
      } else {
        return
      }
    } catch (error) {
      console.log(error)
    }
  }
  const swap = async (e) => {
    e.preventDefault()
    if (e.target.token2Amount.value <= 0) {
      toast(`Please enter a valid amount`)
      return
    }
    let buyToken = e.target.token1Symbol.value
    let buyAmount = e.target.token1Amount.value
    let sellToken = e.target.token2Symbol.value
    let sellAmount = e.target.token2Amount.value
    const tokensList = pairs.map((pair) => pair.token2)
    try {
      if (!window.ethereum) {
        toast('Cannot do this without metamask.')
        return
      }
      // if ANNA is one of the swap tokens
      if (buyToken === 'ANNA' || sellToken === 'ANNA') {
        let index
        // buy ANNA with XXX
        if (buyToken === 'ANNA') {
          index = tokensList.indexOf(sellToken)
          // sell ANNA with XXX
        } else {
          index = tokensList.indexOf(buyToken) // find the pair
        }
        //transact

        const exAddress = pairs[index].address // find exchange address
        const exchange = await connectToContractUsingEthers(
          // connect to the exchange
          exchangeABI,
          exAddress
        )

        const buyTokenAmount = ethers.utils.formatEther(
          String(
            await exchange.sellEst(
              sellToken,
              ethers.utils.parseEther(String(sellAmount))
            )
          ).split(',')[1]
        ) // get ANNA est

        const sellTokenAddress = await exchange.symbAdr(sellToken) // get adr of sell token

        const sellErc20 = await connectToContractUsingEthers(
          // connect to the selltoken
          erc20ABI,
          sellTokenAddress
        )

        await sellErc20.approve(
          exAddress,
          ethers.utils.parseEther(String(sellAmount))
        )

        await exchange.swap(
          sellToken,
          ethers.utils.parseEther(String(sellAmount))
        )
        toast('Transaction pending')
        setEstimate({
          ...estimate,
          buyAmount: '',
          sellAmount: '',
        })
        // buy XXX and sell ZZZ
      } else {
        // sell ZZZ buy ANNA
        const sellIndex = tokensList.indexOf(sellToken)

        const sellAddress = pairs[sellIndex].address
        const exchange1 = await connectToContractUsingEthers(
          exchangeABI,
          sellAddress
        )
        const annaAmount = ethers.utils.formatEther(
          String(
            await exchange1.sellEst(
              sellToken,
              ethers.utils.parseEther(String(sellAmount))
            )
          ).split(',')[1]
        )

        const sellTokenAddress = await exchange1.symbAdr(sellToken)

        const sellErc20 = await connectToContractUsingEthers(
          // connect to the selltoken
          erc20ABI,
          sellTokenAddress
        )

        await sellErc20.approve(
          sellAddress,
          ethers.utils.parseEther(String(sellAmount))
        )

        await exchange1.swap(
          sellToken,
          ethers.utils.parseEther(String(sellAmount))
        )
        // sell ANNA buy XXX

        const buyIndex = tokensList.indexOf(buyToken)
        const buyAddress = pairs[buyIndex].address
        const exchange2 = await connectToContractUsingEthers(
          exchangeABI,
          buyAddress
        )
        const buyTokenAmount = ethers.utils.formatEther(
          String(
            await exchange2.sellEst(
              'ANNA',
              ethers.utils.parseEther(String(annaAmount))
            )
          ).split(',')[1]
        )

        const annaTokenAddress = await exchange1.symbAdr('ANNA')

        const annaErc20 = await connectToContractUsingEthers(
          erc20ABI,
          annaTokenAddress
        )
        await annaErc20.approve(
          buyAddress,
          ethers.utils.parseEther(String(annaAmount))
        )

        await exchange2.swap(
          'ANNA',
          ethers.utils.parseEther(String(annaAmount))
        )
        setEstimate({
          ...estimate,
          buyAmount: '',
          sellAmount: '',
        })
        toast(`Transaction pending`)
      }
    } catch (error) {
      toast(`Uups, something went wrong`)
    }
  }

  return (
    <div>
      <ToastContainer position="top-right" />

      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-gray-500 px-4 pt-5 pb-4 text-left shadow-[0px_0px_10px_5px_#B794F4] shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <form onSubmit={(e) => swap(e)}>
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <div className="text-md mb-2 font-medium leading-6 text-white">
                  Instant trades with low fees
                </div>
                <div className="mb-2 rounded-xl border-2 border-solid border-green-500 bg-gradient-to-r from-green-400 to-cyan-500 text-sm font-bold">
                  <div className="text-white">You receive</div>
                  <div className="mt-2 flex justify-between">
                    <select
                      id="token1Symbol"
                      className="w-28 rounded-xl"
                      onChange={(e) => toggleToken1(e)}
                    >
                      {tokens.tokenBuy.map((token) => (
                        <option key={token} value={token}>
                          {token}
                        </option>
                      ))}
                    </select>{' '}
                    <input
                      className=" overflow-hidden rounded-xl bg-gray-400 p-0 text-center"
                      id="token1Amount"
                      name="token1Amount"
                      type="text"
                      minLength="0"
                      maxLength="30"
                      required
                      value={estimate.buyAmount || ''}
                      readOnly
                    ></input>{' '}
                  </div>
                </div>
                <div className="rounded-xl border-2 border-solid border-red-400 bg-gradient-to-r from-red-400 to-purple-300 text-sm font-bold">
                  <div className=" text-white">You pay</div>
                  <div className="mt-2 flex justify-between">
                    <select
                      id="token2Symbol"
                      className="w-28 rounded-xl"
                      onChange={(e) => toggleToken2(e)}
                    >
                      {tokens.tokenSell.map((token) => (
                        <option key={token} value={token}>
                          {token}
                        </option>
                      ))}
                    </select>{' '}
                    <input
                      id="token2Amount"
                      className="overflow-hidden rounded-xl p-0 text-center"
                      type="text"
                      minLength="0"
                      maxLength="30"
                      required
                      value={tokens.tokenSellAmount || ''}
                      onChange={(e) => getEstimate(e)}
                    ></input>{' '}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-center gap-3 sm:mt-6">
              <Button type="submit" color="gradient" className="w-28">
                Swap
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

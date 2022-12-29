import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { submitDataToFireStore, deleteDataFromFireStore } from './firestore'

// get the contract using ethers with abi and address as input
export const connectToContractUsingEthers = async (abi, contractAddress) => {
  try {
    if (!window.ethereum) {
      return
    }
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const connectedContract = new ethers.Contract(
      contractAddress,
      abi.abi,
      signer
    )
    return connectedContract
  } catch (error) {
    console.log(error)
  }
}

// check if metamask is connected
export const checkIfWalletIsConnected = async (setCurrentAccount) => {
  const { ethereum } = window
  if (!ethereum) {
    console.log('Please install metamask')
    return
  } else {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts.length > 0) {
      let account = accounts[0]
      setCurrentAccount(account)
      console.log(account)
    } else console.log('No authorized account found')
  }
}

// creates a new exchange via factory and uploads the new contract address and tokens into firestore upon sucessfull emitted event
export const useNewExchangeCreatedEvent = async (abi, contractAddress) => {
  try {
    if (typeof window == 'undefined') return
    if (window.ethereum) {
      const [newExchangeCreated, setNewExchangeCreated] = useState('')
      const [update, setUpdate] = useState(false)
      const onExchangeCreated = async (exchangeAddress, t1, t2, timestamp) => {
        const message = {
          address: exchangeAddress,
          token1: t1,
          token2: t2,
        }
        if (message.address) {
          setUpdate(true)
        }
        setNewExchangeCreated(message)
        await submitDataToFireStore(
          newExchangeCreated.address,
          newExchangeCreated.token1,
          newExchangeCreated.token2
        )
      }
      const listen = async () => {
        let contract = await connectToContractUsingEthers(abi, contractAddress)
        console.log(`listening to exchange creation... `)
        contract.on('ExchangeCreated', onExchangeCreated)
        return () => {
          if (contract) {
            contract.off('ExchangeCreated', onExchangeCreated)
          }
        }
      }
      useEffect(() => {
        listen()
      }, [update])
      return [newExchangeCreated]
    }
  } catch (error) {
    console.log(error)
  }
}

// delete exchange listener
export const useExchangeRemoved = async (abi, contractAddress) => {
  try {
    if (typeof window == 'undefined') return
    if (window.ethereum) {
      const [exchangeRemoved, setExchangeRemoved] = useState('')
      const [update, setUpdate] = useState(false)
      const onExchangeRemoved = async (isDone, t1, t2, timestamp) => {
        const message = {
          isDone: isDone,
          token1: t1,
          token2: t2,
        }
        if (message.isDone) {
          setUpdate(true)
        }
        setExchangeRemoved(message)
        await deleteDataFromFireStore(
          exchangeRemoved.isDone,
          exchangeRemoved.token1,
          exchangeRemoved.token2
        )
      }
      const listen = async () => {
        let contract = await connectToContractUsingEthers(abi, contractAddress)
        console.log(`listening to exchange deletion... `)
        contract.on('ExchangeRemoved', onExchangeRemoved)
        return () => {
          if (contract) {
            contract.off('ExchangeRemoved', onExchangeRemoved)
          }
        }
      }

      useEffect(() => {
        listen()
      }, [update])
      return [exchangeRemoved]
    }
  } catch (error) {
    console.log(error)
  }
}

// get liquidity estimate
export const useTest = async (abi, contractAddress, amount) => {
  const [estimate, setEstimate] = useState('')
  try {
    // if (typeof window == 'undefined' || !window.ethereum) return
    const exchangeContract = await connectToContractUsingEthers(
      abi,
      contractAddress
    )
    console.log(exchangeContract)
    const fetching = async () => {
      let token2Estimate = await exchangeContract.getEstimateOfToken2(amount)
      console.log(token2Estimate)
      setEstimate(token2Estimate)
      console.log(estimate)
    }
    useEffect(() => {
      fetching()
    }, [amount])
    return [estimate]
  } catch (error) {
    console.log(error)
  }
}

/*
  const test = async () => {
    try {
      if (typeof window == 'undefined') return
      if (window.ethereum) {
        const exchangeContract = await connectToContractUsingEthers(
          exchangeABI,
          exchangeAddress
        )
        console.log(exchangeContract)
        let token2Estimate = await exchangeContract.getEstimateOfToken2(20)
        console.log(String(token2Estimate).split(',')[0])
      }
    } catch (error) {
      console.log(error)
    }
  }
  test()*/

import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { submitDataToFireStore } from './firestore'

// get contact using ethers with abi and address as input
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
    if (!window.ethereum) {
      return
    }
    const [newExchangeCreated, setNewExchangeCreated] = useState('')
    const onExchangeCreated = async (exchangeAddress, t1, t2, timestamp) => {
      const message = {
        address: exchangeAddress,
        token1: t1,
        token2: t2,
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
    }, [])
    return [newExchangeCreated]
  } catch (error) {
    console.log(error)
  }
}

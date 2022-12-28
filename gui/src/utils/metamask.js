import { ethers } from 'ethers'

export const connectToContractUsingEthers = async (abi, contractAddress) => {
  try {
    if (!ethereum) {
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

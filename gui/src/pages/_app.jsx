import 'focus-visible'
import '@/styles/tailwind.css'
import { useEffect, useState, createContext } from 'react'

export const WalletContext = createContext()

export default function App({ Component, pageProps }) {
  const [currentAccount, setCurrentAccount] = useState('')

  // function to check if metamask is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window
    if (!ethereum) {
      console.log('Please install metamask')
      return
    } else {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        let account = accounts[0]
        console.log('authorised account:', account)
        setCurrentAccount(account)
      } else console.log('No authorized account found')
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])
  return (
    <WalletContext.Provider value={[currentAccount, setCurrentAccount]}>
      <Component {...pageProps} />
    </WalletContext.Provider>
  )
}

/*
export default function App({ Component, pageProps }) {
  const context = useContext(WalletContext)
  console.log(context)
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}
*/

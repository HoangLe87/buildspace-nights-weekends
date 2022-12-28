import 'focus-visible'
import '@/styles/tailwind.css'
import { useEffect, useState, createContext } from 'react'
import { checkIfWalletIsConnected } from '@/utils/metamask'

export const WalletContext = createContext()

export default function App({ Component, pageProps }) {
  const [currentAccount, setCurrentAccount] = useState('')
  useEffect(() => {
    checkIfWalletIsConnected(setCurrentAccount)
  }, [])
  return (
    <WalletContext.Provider value={[currentAccount, setCurrentAccount]}>
      <Component {...pageProps} />
    </WalletContext.Provider>
  )
}

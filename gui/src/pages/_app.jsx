import 'focus-visible'
import '@/styles/tailwind.css'
import { useEffect, useState, createContext } from 'react'
import { checkIfWalletIsConnected } from '@/utils/metamask'
import annaJson from '../../public/static/anna.json'
import erc20Json from '../../public/static/erc20.json'
import loveJson from '../../public/static/love.json'
import exJson from '../../public/static/ex.json'
import exFacJson from '../../public/static/exFac.json'
import investmentsJson from '../../public/static/investments.json'

export const WalletContext = createContext()

export default function App({ Component, pageProps }) {
  const [currentAccount, setCurrentAccount] = useState('')
  const contractsStatic = {
    anna: {
      address: '0xefD535B91D30d59492BB2569225d8307fa6b747b',
      json: annaJson,
    },
    love: {
      address: '0xE129970DEAA685Ee0142D5DDd086780EB2bf2607',
      json: loveJson,
    },
    erc20: {
      json: erc20Json,
    },
    ex: {
      json: exJson,
    },
    exFac: {
      address: '0xc9c16a388c878EEda31ec5F7592413339A4F0099',
      json: exFacJson,
    },
    investments: {
      address: '0xf263166449cff8F9D8B32bD51a38ee0bEFF282F6',
      json: investmentsJson,
    },
  }

  useEffect(() => {
    checkIfWalletIsConnected(setCurrentAccount)
  }, [])
  return (
    <WalletContext.Provider
      value={[currentAccount, setCurrentAccount, contractsStatic]}
    >
      <Component {...pageProps} />
    </WalletContext.Provider>
  )
}

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
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'

export const WalletContext = createContext()

export default function App({ Component, pageProps }) {
  const [currentAccount, setCurrentAccount] = useState('')
  const activeChainId = ChainId.Goerli
  const contractsStatic = {
    anna: {
      address: '0xbAd23F5E81049a4d5b74097Cf5d00db92574995a',
      json: annaJson,
    },
    love: {
      address: '0x6b0b607951fd708ACc9836e90D15D4331c0d61e9',
      json: loveJson,
    },
    erc20: {
      json: erc20Json,
    },
    ex: {
      json: exJson,
    },
    exFac: {
      address: '0xf80a2e20Ac6b0A6b54AA94C97dDEaA8Ac0C67CCd',
      json: exFacJson,
    },
    investments: {
      address: '0x84A4d6fc25431F1C7bd21799464FC0f98985377a',
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
      <ThirdwebProvider desiredChainId={activeChainId}>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </WalletContext.Provider>
  )
}

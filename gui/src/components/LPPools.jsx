import { LPPoolCreate } from './LPPoolCreate'
import { useState, createContext } from 'react'
import { LPPoolsDisplay } from './LPPoolsDisplay'
import {
  useNewExchangeCreatedEvent,
  useExchangeRemoved,
} from '@/utils/metamask'
import { useFetchAllFirestoreData } from '@/utils/firestore'
import { WalletContext } from '@/pages/_app'
import { useContext } from 'react'

export const PoolDetailsContext = createContext()

export function LPPools() {
  const [currentAccount, setCurrentAccount, accountsStatic] =
    useContext(WalletContext)
  const EXCHANGE_FACTORY = accountsStatic.exFac.address
  const exFacJson = accountsStatic.exFac.json
  const [isCreatePoolBoxOpen, setCreatePoolBoxOpen] = useState(false)
  const [isDepositBoxOpen, setDepositBoxOpen] = useState(false)
  const [isWithdrawBoxOpen, setWithdrawBoxOpen] = useState(false)
  // listening to any emitted events for exchange creation
  const { newExchangeCreated } = useNewExchangeCreatedEvent(
    exFacJson,
    EXCHANGE_FACTORY
  )
  // listening to any emitted events for exchange deletion
  const { exchangeRemoved } = useExchangeRemoved(exFacJson, EXCHANGE_FACTORY)
  const [pairs, setPairs] = useFetchAllFirestoreData('LiquidityPools')

  return (
    <div className="my-60 px-4 sm:px-6 lg:px-8">
      <PoolDetailsContext.Provider
        value={[
          isCreatePoolBoxOpen,
          setCreatePoolBoxOpen,
          pairs,
          setPairs,
          exFacJson,
          EXCHANGE_FACTORY,
          isDepositBoxOpen,
          setDepositBoxOpen,
          isWithdrawBoxOpen,
          setWithdrawBoxOpen,
        ]}
      >
        <LPPoolsDisplay />
        {isCreatePoolBoxOpen && <LPPoolCreate />}
      </PoolDetailsContext.Provider>
    </div>
  )
}

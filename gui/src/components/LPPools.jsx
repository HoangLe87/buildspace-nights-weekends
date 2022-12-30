import { LPPoolCreate } from './LPPoolCreate'
import { useState, createContext } from 'react'
import { LPPoolsDisplay } from './LPPoolsDisplay'
import abi from '../../public/static/exFac.json'
import {
  useNewExchangeCreatedEvent,
  useExchangeRemoved,
} from '@/utils/metamask'
import { useFetchAllFirestoreData } from '@/utils/firestore'

export const PoolDetailsContext = createContext()

export function LPPools() {
  console.log('Pools')
  const EXCHANGE_FACTORY = '0x6D7ED0eCd609097211d5144B55f36291959dDA26'
  const [isCreatePoolBoxOpen, setCreatePoolBoxOpen] = useState(false)
  const [isDepositBoxOpen, setDepositBoxOpen] = useState(false)
  const [isWithdrawBoxOpen, setWithdrawBoxOpen] = useState(false)
  // listening to any emitted events for exchange creation
  const { newExchangeCreated } = useNewExchangeCreatedEvent(
    abi,
    EXCHANGE_FACTORY
  )
  // listening to any emitted events for exchange deletion
  const { exchangeRemoved } = useExchangeRemoved(abi, EXCHANGE_FACTORY)
  const [pairs, setPairs] = useFetchAllFirestoreData('LiquidityPools')

  return (
    <div className="my-60 px-4 sm:px-6 lg:px-8">
      <PoolDetailsContext.Provider
        value={[
          isCreatePoolBoxOpen,
          setCreatePoolBoxOpen,
          pairs,
          setPairs,
          abi,
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

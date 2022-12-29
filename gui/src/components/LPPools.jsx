import { LPPoolCreate } from './LPPoolCreate'
import { useState, createContext } from 'react'
import { LPPoolsDisplay } from './LPPoolsDisplay'
import { LPPoolDeposit } from './LPPoolDeposit'
import { LPPoolWithdraw } from './LPPoolWithdraw'
import { useFetchAllFirestoreData } from '@/utils/firestore'
import abi from '../../public/static/exchangeFactory.json'
import {
  useNewExchangeCreatedEvent,
  useExchangeRemoved,
} from '@/utils/metamask'

export const PoolDetailsContext = createContext()

export function LPPools() {
  const EXCHANGE_FACTORY = '0xDBBB9ad31b0bf8Ab53a54Da6f62b10F7b4b1240e'
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

import { CreatePool } from './CreatePool'
import { useState, useEffect, createContext } from 'react'
import { PoolsDisplay } from './PoolsDisplay'
import { useFetchAllFirestoreData, useTest } from '@/utils/firestore'

export const PoolDetailsContext = createContext()

export function Pools() {
  const [createPool, setCreatePool] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [pairs, setPairs] = useFetchAllFirestoreData('LiquidityPools')

  return (
    <PoolDetailsContext.Provider
      value={[
        createPool,
        setCreatePool,
        pairs,
        setPairs,
        isLoaded,
        setIsLoaded,
      ]}
    >
      <div className="my-60 px-4 sm:px-6 lg:px-8">
        <PoolsDisplay />
        {createPool && <CreatePool />}
      </div>
    </PoolDetailsContext.Provider>
  )
}

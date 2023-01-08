import { NavLink } from './NavLink'
import { useState } from 'react'
import Router, { useRouter } from 'next/router'

export function DexNavBar({ currentPage }) {
  const router = useRouter()
  const tabs = ['Swap', 'Pools', 'Investments', 'Anna']
  const swap =
    currentPage === tabs[0]
      ? 'border-indigo-500 text-indigo-600 text-gray-500 hover:cursor-pointer hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
      : 'border-transparent text-gray-500 hover:cursor-pointer hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'

  const pools =
    currentPage === tabs[1]
      ? 'border-indigo-500 text-indigo-600 text-gray-500 hover:cursor-pointer hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
      : 'border-transparent text-gray-500 hover:cursor-pointer hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'

  const investments =
    currentPage === tabs[2]
      ? 'border-indigo-500 text-indigo-600 text-gray-500 hover:cursor-pointer hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
      : 'border-transparent text-gray-500 hover:cursor-pointer hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'

  const anna =
    currentPage === tabs[3]
      ? 'border-indigo-500 text-indigo-600 text-gray-500 hover:cursor-pointer hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
      : 'border-transparent text-gray-500 hover:cursor-pointer hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'

  return (
    <div className="flex w-screen justify-center px-4 sm:px-6 lg:px-8">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={currentPage}
          onChange={(e) => router.push(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tabs.indexOf(tab)}>{tab}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <NavLink href="Swap" className={swap}>
              {' '}
              Swap{' '}
            </NavLink>
            <NavLink href="Pools" className={pools}>
              Pools{' '}
            </NavLink>
            <NavLink href="Investments" className={investments}>
              {' '}
              Investments{' '}
            </NavLink>
            <NavLink href="Anna" className={anna}>
              {' '}
              Anna{' '}
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}

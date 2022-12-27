import { NavLink } from './NavLink'
import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import { useContext } from 'react'
import { WalletContext } from '../pages/_app'

export const Header = () => {
  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const changeAccount = async () => {
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    })
  }

  const [currentAccount, setCurrentAccount] = useContext(WalletContext)
  return (
    <header className="py-10">
      <nav className="relative z-50 flex justify-between">
        <div className="flex items-center md:gap-x-12">
          <Logo className="h-10 w-auto" />
          <div className=" md:flex md:gap-x-6">
            <NavLink page={'Dex'}>Dex</NavLink>
            <NavLink page={'Marketplace'}>Marketplace</NavLink>
            <NavLink page={'Games'}>Games</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-x-5 md:gap-x-8">
          <div className="hidden md:block">
            <NavLink page={'/Dashboard'}>Dashboard</NavLink>
          </div>
          {!currentAccount && (
            <Button onClick={() => connectWallet()} color="blue">
              <span>Connect Wallet</span>
            </Button>
          )}
          {currentAccount && (
            <Button color="blue" onClick={() => changeAccount()}>
              <span className="w-24 max-w-xs overflow-hidden px-1">
                {currentAccount}
              </span>
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

import { NavLink } from './NavLink'
import { Logo } from '@/components/Logo'
import { ConnectWallet } from '@thirdweb-dev/react'

import { useRouter } from 'next/router'

export const Header = () => {
  const router = useRouter()

  const className =
    'inline-block cursor-pointer rounded-lg py-1 px-2 text-sm text-slate-100 font-bold hover:bg-slate-100 hover:text-slate-900'

  return (
    <header className="absolute w-screen shadow-[0px_0px_10px_5px_#805ad5]">
      <div className="w-full bg-gray-700/80 py-5 pr-5">
        <nav className="z-1 relative flex justify-between">
          <div className="flex items-center gap-x-6 md:gap-x-16">
            <Logo className="h-10 w-auto" />
            <div className="md:flex md:gap-x-8">
              <div className={className} onClick={() => router.push('/Swap')}>
                Dex
              </div>
              <NavLink className={className} href={'Marketplace'}>
                Marketplace
              </NavLink>
              <NavLink className={className} href={'Games'}>
                Games
              </NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <NavLink className={className} href={'/Dashboard'}>
                Dashboard
              </NavLink>
            </div>
            <ConnectWallet accentColor="black" />
          </div>
        </nav>
      </div>
    </header>
  )
}

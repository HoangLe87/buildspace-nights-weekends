import { NavLink } from './NavLink'
import { Logo } from '@/components/Logo'
import { ConnectWallet } from '@thirdweb-dev/react'
import { useState } from 'react'

export const Header = () => {
  const className =
    'inline-block cursor-pointer rounded-lg py-1 px-2 text-sm text-slate-100 font-bold hover:bg-slate-100 hover:text-slate-900'

  return (
    <header className="absolute w-screen shadow-[0px_0px_10px_5px_#805ad5]">
      <div className="w-full bg-gray-700/80 py-5 pr-5">
        <nav className="z-1 relative flex justify-between">
          <div className="hidden items-center gap-x-6 sm:flex md:gap-x-16">
            <Logo className="h-10 w-auto" />
            <div className="md:flex md:gap-x-8">
              <NavLink className={className} href={'Swap'}>
                Dex
              </NavLink>
              <NavLink className={className} href={'Marketplace'}>
                Marketplace
              </NavLink>
              <NavLink className={className} href={'Games'}>
                Games
              </NavLink>
            </div>
          </div>
          <div className="block items-center gap-x-6 sm:hidden md:gap-x-16">
            <HamburgerMenu />
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <NavLink className={className} href={'/Dashboard'}>
                Dashboard
              </NavLink>
            </div>
            <div className="shadow-[0px_0px_10px_5px_#805ad5]">
              <ConnectWallet accentColor="black" />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`
  const style = 'hover:cursor text-white'
  return (
    <div className="ml-2 shadow-[0px_0px_10px_5px_#805ad5]">
      <button
        className="group flex h-12 w-12 flex-col items-center justify-center rounded border-2 border-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`${genericHamburgerLine} ${
            isOpen
              ? 'translate-y-3 rotate-45 opacity-50 group-hover:opacity-100'
              : 'opacity-50 group-hover:opacity-100'
          }`}
        />
        <div
          className={`${genericHamburgerLine} ${
            isOpen ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'
          }`}
        />
        <div
          className={`${genericHamburgerLine} ${
            isOpen
              ? '-translate-y-3 -rotate-45 opacity-50 group-hover:opacity-100'
              : 'opacity-50 group-hover:opacity-100'
          }`}
        />
      </button>
      {isOpen && (
        <div>
          <div className="absolute ml-2 grid gap-2 bg-black p-4 shadow-[0px_0px_10px_5px_#805ad5] ">
            <NavLink className={style} href={'Swap'}>
              Dex
            </NavLink>
            <NavLink className={style} href={'Marketplace'}>
              Marketplace
            </NavLink>
            <NavLink className={style} href={'Games'}>
              Games
            </NavLink>
            <NavLink className={style} href={'Dashboard'}>
              Dashboard
            </NavLink>
          </div>
        </div>
      )}
    </div>
  )
}

import { NavLink } from './NavLink'
import { Logo } from '@/components/Logo'
import { ConnectWallet } from '@thirdweb-dev/react'
import { useState } from 'react'
import { Button } from './Button'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import profileWhite from '../images/icons/profileWhite.png'
import Image from 'next/image'

const current =
  'inline-block font-cinzel glow cursor-pointer transition delay-150 rounded-lg py-1 px-2 text-sm text-slate-100 font-bold'
const notCurrent =
  'inline-block text-slate-600 transition delay-150 hover:text-slate-400 font-cinzel  cursor-pointer rounded-lg py-1 px-2 text-sm text-slate-100 font-bold'

export const Header = ({ currentPage }) => {
  const pages = ['Swap', 'Marketplace', 'Games', 'Dashboard']

  return (
    <header className="absolute w-screen shadow-[0px_0px_10px_5px_#805ad5]">
      <div className="w-full bg-gray-900 py-5 pr-5">
        <nav className="z-1 relative flex justify-between">
          <div className="hidden items-center gap-x-6 sm:flex md:gap-x-16">
            <Logo className="h-10 w-auto" />
            <div className="md:flex md:gap-x-8">
              {pages.map((page) => (
                <NavLink
                  className={page === currentPage ? current : notCurrent}
                  href={page}
                >
                  {page}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="block items-center gap-x-6 sm:hidden md:gap-x-16">
            <HamburgerMenu />
          </div>

          <div className="flex items-center gap-x-5 md:gap-x-8">
            <Wallet />
          </div>
        </nav>
      </div>
    </header>
  )
}

export function Wallet() {
  const [isOpen, setIsOpen] = useState(false)
  const provider = new GoogleAuthProvider()
  return (
    <div
      className="font-cinzel text-white "
      onMouseOver={() => setIsOpen(true)}
      onMouseLeave={() => setTimeout(() => setIsOpen(false), 200)}
    >
      <Image
        src={profileWhite}
        alt=""
        className=" mr-1 h-8 w-8 rounded-full bg-slate-100/10 transition delay-100 hover:bg-violet-200/50 hover:shadow-[0px_0px_10px_5px_#805ad5]"
      />
      {isOpen && (
        <div className="absolute right-1 z-10 grid h-60 w-60 items-center justify-center gap-2 rounded-xl border border-solid border-stone-500 bg-slate-800 px-4 py-8 delay-150 hover:shadow-[0px_0px_10px_5px_#805ad5] ">
          <ConnectWallet className={notCurrent} accentColor="black" />

          <input type="email"></input>
          <Button className={notCurrent}>Log In with Google</Button>
          <Button className={notCurrent}>Log In with Facebook</Button>
        </div>
      )}
    </div>
  )
}

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-slate-100 transition ease transform duration-300`
  return (
    <div
      className="ml-2 shadow-[0px_0px_10px_5px_#805ad5] "
      onMouseOver={() => setIsOpen(true)}
      onMouseLeave={() => setTimeout(() => setIsOpen(false), 200)}
    >
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
          <div className=" absolute z-10 ml-2 grid gap-1 rounded-xl border border-solid border-stone-500 bg-slate-800 px-1 py-8 delay-150 hover:shadow-[0px_0px_10px_5px_#805ad5] ">
            <NavLink className={notCurrent} href={'/'}>
              Home
            </NavLink>
            <NavLink className={notCurrent} href={'Swap'}>
              Dex
            </NavLink>
            <NavLink className={notCurrent} href={'Marketplace'}>
              Marketplace
            </NavLink>
            <NavLink className={notCurrent} href={'Games'}>
              Games
            </NavLink>
            <NavLink className={notCurrent} href={'Dashboard'}>
              Dashboard
            </NavLink>
            <NavLink className={notCurrent} href={'secure'}>
              Secure
            </NavLink>
          </div>
        </div>
      )}
    </div>
  )
}

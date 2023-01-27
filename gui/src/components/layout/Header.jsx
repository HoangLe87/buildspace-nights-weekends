import { NavLink } from '../reusable/NavLink'
import { Logo } from '@/components/layout/Logo'
import { ConnectWallet, useAddress } from '@thirdweb-dev/react'
import { useState } from 'react'
import { Button } from '../reusable/Button'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import profileWhite from '../../images/icons/profileGray.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore'
import initializeFirebaseClient from '../../../firebase/firebaseConfig'

const current =
  'inline-block font-cinzel glow cursor-pointer transition delay-150 rounded-lg py-1 px-2 text-sm text-slate-100 font-bold'
const notCurrent =
  'inline-block text-slate-600 transition delay-150 hover:text-slate-400 font-cinzel  cursor-pointer rounded-lg py-1 px-2 text-sm font-bold'

export const Header = ({ currentPage }) => {
  const [pages, setPages] = useState([
    {
      name: 'DeFi',
      subs: ['Swap', 'Pools', 'Investments', 'Anna', 'CFD'],
      current: false,
    },
    {
      name: 'Marketplace',
      subs: ['News'],
      current: false,
    },
    {
      name: 'Education',
      subs: ['Playground', 'Library', 'School'],
      current: false,
    },
    {
      name: 'Dashboard',
      subs: [],
      current: false,
    },
  ])

  const dropDown = (i) => {
    const newPages = pages.map((page) =>
      page !== i ? page : { ...i, current: true }
    )
    setPages(newPages)
  }

  const dropDownCollapse = async (i) => {
    const newPages = pages.map((page) =>
      page !== i ? page : { ...i, current: false }
    )
    setPages(newPages)
  }

  return (
    <header className="absolute z-10 w-screen shadow-[0px_0px_10px_5px_#805ad5]">
      <ToastContainer position="top-right" />
      <div className="w-full bg-gray-900 py-5 pr-5">
        <nav className="relative z-10 flex justify-between">
          <div className="hidden items-center gap-x-6 sm:flex md:gap-x-16">
            <Logo className="h-10 w-auto" />
            <div className="md:flex md:gap-x-8">
              {pages.map((page) => (
                <div
                  key={page.name}
                  onMouseOver={() => dropDown(page)}
                  onMouseLeave={() => dropDownCollapse(page)}
                >
                  <NavLink
                    className={page.name === currentPage ? current : notCurrent}
                    href={`/${page.name}`}
                  >
                    {page.name}
                  </NavLink>
                  {page.current && page.subs.length > 0 && (
                    <div className=" absolute ml-2 grid w-28 gap-1 rounded-xl border-b-[2px] border-stone-500 bg-gray-900  px-1 py-8 delay-150 ">
                      {page.subs.map((i) => (
                        <NavLink
                          key={i}
                          href={`/${page.name}/${i}`}
                          className={notCurrent}
                        >
                          {i}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
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
  const { db, auth } = initializeFirebaseClient()
  const router = useRouter()
  const address = useAddress()
  const [isOpen, setIsOpen] = useState(false)
  const provider = new GoogleAuthProvider()

  const logOut = () => {
    signOut(auth)
    setIsOpen(false)
    router.push('/')
  }

  const logIn = async () => {
    if (!address) return toast('Please connect wallet first')

    try {
      const result = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      const user = result.user
      const usersRef = doc(db, 'Users', user.email)
      getDoc(usersRef).then((doc) => {
        if (!doc.exists()) {
          setDoc(
            usersRef,
            {
              address: address,
              email: user.email,
              level: 1,
              createdAt: serverTimestamp(),
              BTCUSDT: 0,
            },
            { merge: true }
          )
        }
      })
      const tokenID = await auth.currentUser.getIdToken()
      const data = await fetch('api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokenID),
      })
      const response = await data.json()
      setIsOpen(false)
      router.push('/Dashboard')
    } catch (error) {
      toast(error)
      setIsOpen(false)
    }
  }

  return (
    <div
      className="font-cinzel text-white "
      onMouseOver={() => setIsOpen(true)}
      onMouseLeave={() => setTimeout(() => setIsOpen(false), 200)}
    >
      <Image
        src={profileWhite}
        onClick={() => setIsOpen(!isOpen)}
        alt=""
        className=" mr-1 h-8 w-8 rounded-full transition delay-100 hover:bg-white hover:shadow-[0px_0px_10px_5px_#805ad5]"
      />
      {isOpen && (
        <div className="absolute right-1 z-10 grid w-60 items-center justify-center gap-2 overflow-hidden rounded-xl border border-solid border-stone-500 bg-slate-800 px-4 py-8 delay-150 hover:shadow-[0px_0px_10px_5px_#805ad5] sm:w-fit md:h-60 ">
          <ConnectWallet className={notCurrent} accentColor="black" />
          {!auth.currentUser ? (
            <Button onClick={logIn} className={notCurrent}>
              Log In with Google
            </Button>
          ) : (
            <>
              <div className="text-center">
                {auth.currentUser.email.split('@')[0]}
              </div>
              <Button onClick={logOut}>Log out</Button>
            </>
          )}
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
            <NavLink className={notCurrent} href={'/DeFi'}>
              DeFi
            </NavLink>
            <NavLink className={notCurrent} href={'/Marketplace'}>
              Marketplace
            </NavLink>
            <NavLink className={notCurrent} href={'/Education'}>
              Education
            </NavLink>
            <NavLink className={notCurrent} href={'/Dashboard'}>
              Dashboard
            </NavLink>
          </div>
        </div>
      )}
    </div>
  )
}

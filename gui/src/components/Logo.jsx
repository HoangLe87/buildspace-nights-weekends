import Image from 'next/image'

import logo from '../images/logos/logo.png'

import { useRouter } from 'next/router'

export function Logo(isGlowing) {
  const router = useRouter()
  return (
    <div
      className="ml-2 flex items-center justify-between gap-2"
      onClick={() => router.push('/')}
    >
      <Image
        src={logo}
        priority
        className="glow h-8 w-8 hover:cursor-pointer "
        alt=""
      />

      <span
        className={
          isGlowing === true
            ? ' glow invisible relative text-2xl  text-slate-100 hover:cursor-pointer sm:visible '
            : ' invisible relative text-2xl  text-slate-100 hover:cursor-pointer sm:visible '
        }
      >
        ANNA{' '}
      </span>
    </div>
  )
}

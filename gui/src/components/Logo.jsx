import Image from 'next/image'

import logo from '../images/logo.png'

import { useRouter } from 'next/router'

export function Logo(props) {
  const router = useRouter()
  return (
    <div
      className=" flex items-center justify-between"
      onClick={() => router.push('/')}
    >
      <Image
        src={logo}
        priority
        className="h-16 w-16 hover:cursor-pointer "
        alt=""
      />

      <span className="invisible relative bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text font-elsie text-2xl text-transparent hover:cursor-pointer sm:visible ">
        ANNA{' '}
      </span>
    </div>
  )
}

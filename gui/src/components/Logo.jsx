import Image from 'next/image'

import logo from '../images/logo.png'

import { useRouter } from 'next/router'

export function Logo(props) {
  const router = useRouter()
  return (
    <div className="ml-2 flex items-center" onClick={() => router.push('/')}>
      <Image
        src={logo}
        priority
        className="h-16 w-16 hover:cursor-pointer "
        alt=""
      />

      <span className="relative inline-block bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text font-elsie text-2xl text-transparent hover:cursor-pointer ">
        ANNA{' '}
      </span>
    </div>
  )
}

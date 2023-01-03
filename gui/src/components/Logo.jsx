import Image from 'next/image'

import logo1 from '../images/logos/logo1.svg'

import { useRouter } from 'next/router'

export function Logo(props) {
  const router = useRouter()
  return (
    <div
      className="ml-2 flex items-center gap-2"
      onClick={() => router.push('/')}
    >
      <Image src={logo1} className="h-32 w-32 hover:cursor-pointer" alt="" />
    </div>
  )
}

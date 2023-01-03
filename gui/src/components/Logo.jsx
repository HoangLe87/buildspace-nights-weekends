import Image from 'next/image'

import logo from '../images/logos//vector/default-monochrome.svg'

import { useRouter } from 'next/router'

export function Logo(props) {
  const router = useRouter()
  return (
    <div
      className="ml-2 flex items-center gap-2"
      onClick={() => router.push('/')}
    >
      <Image src={logo} className="h-20 w-24 hover:cursor-pointer " alt="" />
    </div>
  )
}

import Image from 'next/image'
import logo from '../images/nnneon.svg'
import { useRouter } from 'next/router'

export function Logo(props) {
  const router = useRouter()
  return (
    <div className="flex items-center gap-2" onClick={() => router.push('/')}>
      <Image src={logo} className="h-14 w-14 hover:cursor-pointer" alt="" />
      <div className="hover:cursor-pointer">ANNA</div>
    </div>
  )
}

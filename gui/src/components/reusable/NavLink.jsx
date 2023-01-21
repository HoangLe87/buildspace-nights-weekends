import { useRouter } from 'next/router'

export function NavLink({ href, className, children }) {
  const router = useRouter()
  return (
    <div onClick={() => router.replace(href)} className={className}>
      {children}
    </div>
  )
}

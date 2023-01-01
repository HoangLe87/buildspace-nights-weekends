import { useRouter } from 'next/router'

export function NavLink({ href, className, children }) {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(href)}
      className={className}
    >
      {children}
    </div>
  )
}

import { useRouter } from 'next/router'

export function NavLink({ page, children }) {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(page)}
      className="inline-block cursor-pointer rounded-lg py-1 px-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </div>
  )
}

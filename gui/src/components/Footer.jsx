import Link from 'next/link'

import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { SiGitbook } from 'react-icons/si'

export function Footer() {
  return (
    <footer className="bg-slate-50">
      <div className="py-16">
        <Logo className="mx-auto h-10 w-auto" />
        <nav className="mt-10 text-sm" aria-label="quick links">
          <div className="-my-1 flex justify-center gap-x-6">
            <NavLink href="#features">Dex</NavLink>
            <NavLink href="#testimonials">Marketplace</NavLink>
            <NavLink href="#pricing">Games</NavLink>
            <NavLink href="#pricing">Dashboard</NavLink>
          </div>
        </nav>
      </div>
      <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
        <div className="flex gap-x-6">
          <Link
            href="https://anna-21.gitbook.io/product-docs/"
            className="group"
            aria-label="ANNA on GitBook"
          >
            <SiGitbook className="h-8 w-8" />
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500 sm:mt-0">
          Copyright &copy; {new Date().getFullYear()} ANNA DeFi. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}

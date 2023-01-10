import Link from 'next/link'

import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { SiGitbook } from 'react-icons/si'
import { TfiTwitter } from 'react-icons/tfi'

export function Footer() {
  return (
    <footer className="bg-slate-50">
      <nav className="mt-10 text-sm" aria-label="quick links">
        <div className="-my-1 flex justify-center gap-x-6">
          <NavLink href="/">About us</NavLink>
          <NavLink href="/">Career</NavLink>
          <NavLink href="/">Partnerships</NavLink>
          <NavLink href="/">Guides</NavLink>
        </div>
      </nav>
      <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
        <div className="flex gap-x-6">
          <Link
            href="https://twitter.com/anna_defi_/"
            className="group"
            aria-label="ANNA on Twitter"
          >
            <TfiTwitter className="h-5 w-5" />
          </Link>
          <Link
            href="https://anna-21.gitbook.io/product-docs/"
            className="group"
            aria-label="ANNA on GitBook"
          >
            <SiGitbook className="h-5 w-5" />
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

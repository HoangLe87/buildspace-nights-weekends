import Link from 'next/link'
import { NavLink } from '@/components/reusable/NavLink'
import twitter from '../../images/icons/twitterGray.png'
import book from '../../images/icons/bookGray.png'
import linkedin from '../../images/icons/linkedinGray.png'
import Image from 'next/image'

export function Footer() {
  const className =
    'inline-block text-slate-600 transition delay-150 hover:text-slate-400 font-cinzel  cursor-pointer rounded-lg py-1 px-2 text-sm font-bold'
  return (
    <footer className=" w-screen bg-gray-900 py-5 shadow-[0px_0px_10px_5px_#805ad5]">
      <nav className="mt-10 text-sm" aria-label="quick links">
        <div className="-my-1 flex justify-center gap-x-2 sm:gap-x-6">
          <NavLink className={className} href="/">
            About us
          </NavLink>
          <NavLink className={className} href="/">
            Career
          </NavLink>
          <NavLink className={className} href="/">
            Partnerships
          </NavLink>
          <NavLink className={className} href="/">
            Guides
          </NavLink>
        </div>
      </nav>
      <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
        <div className="flex gap-x-2">
          <Link
            href="https://twitter.com/_anna_defi/"
            className="group"
            aria-label="ANNA on Twitter"
          >
            <Image
              src={twitter}
              alt="twitter"
              className="h-8 w-8 transition delay-100 hover:bg-white hover:shadow-[0px_0px_10px_5px_#805ad5]"
            />
          </Link>
          <Link
            href="https://www.linkedin.com/company/anna-defi/?viewAsMember=true"
            className="group"
            aria-label="ANNA on LinkedIn"
          >
            <Image
              src={linkedin}
              alt="linkedin"
              className="h-8 w-8 transition delay-100 hover:bg-white hover:shadow-[0px_0px_10px_5px_#805ad5]"
            />
          </Link>
          <Link
            href="https://anna-21.gitbook.io/product-docs/"
            className="group"
            aria-label="ANNA on GitBook"
          >
            <Image
              src={book}
              alt="book"
              className="mr-4 h-8 w-8 transition delay-100 hover:bg-white hover:shadow-[0px_0px_10px_5px_#805ad5]"
            />
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

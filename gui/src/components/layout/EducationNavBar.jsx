import { NavLink } from '../reusable/NavLink'
import { useRouter } from 'next/router'

export function EducationNavBar({ currentPage }) {
  const router = useRouter()
  const tabs = [
    'Playground',
    'Library',
    'School',
    'Exams',
    'Newsroom',
    'Trending',
  ]
  const current =
    'border-indigo-500 text-white font-bold hover:cursor-pointer hover:border-gray-300 hover:text-slate-100 whitespace-nowrap border-b-2 py-4 px-1 text-sm'
  const notCurrent =
    'border-transparent text-gray-400 hover:cursor-pointer hover:border-gray-300 hover:text-slate-200 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
  const playground = currentPage === tabs[0] ? current : notCurrent

  const library = currentPage === tabs[1] ? current : notCurrent

  const school = currentPage === tabs[2] ? current : notCurrent

  const exams = currentPage === tabs[3] ? current : notCurrent

  const newsroom = currentPage === tabs[4] ? current : notCurrent

  const trending = currentPage === tabs[4] ? current : notCurrent

  return (
    <div className="mt-60 flex w-screen justify-center px-4 sm:px-6 lg:px-8">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md py-2 pl-3 pr-10 text-base focus:border-indigo-400 focus:outline-none focus:ring-indigo-400 sm:text-sm"
          defaultValue={currentPage}
          onChange={(e) => router.push(`/Education/${e.target.value}`)}
        >
          {tabs.map((tab) => (
            <option key={tabs.indexOf(tab)}>{tab}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="">
          <nav
            className="-mb-px flex space-x-8 rounded-2xl bg-gray-700/80 px-4 shadow-[0px_0px_10px_5px_#805ad5] "
            aria-label="Tabs"
          >
            <NavLink href="/Education/Playground" className={playground}>
              {' '}
              Playground{' '}
            </NavLink>
            <NavLink href="/Education/Library" className={library}>
              Library{' '}
            </NavLink>
            <NavLink href="/Education/School" className={school}>
              {' '}
              School{' '}
            </NavLink>
            <NavLink href="/Education/Exams" className={exams}>
              {' '}
              Exams{' '}
            </NavLink>
            <NavLink href="/Education/Newsroom" className={newsroom}>
              {' '}
              Newsroom{' '}
            </NavLink>
            <NavLink href="/Education/Trending" className={trending}>
              {' '}
              Trending{' '}
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}

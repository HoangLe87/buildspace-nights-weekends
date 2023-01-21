import Image from 'next/image'

import avatarImage1 from '@/images/avatars/anna.png'
import avatarImage2 from '@/images/avatars/hoang.png'
import avatarImage3 from '@/images/avatars/hien.png'

const team = [
  [
    {
      content:
        '"This project is somewhat special to me. Something really meaningful and close to my heart."',
      member: {
        name: 'Anna',
        role: 'Founder',
        image: avatarImage1,
      },
    },
    {
      content:
        '"The blockchain technology exites me. An amazing team to work with and a meaningful project to work on. What more is there to ask?"',
      member: {
        name: 'Hoang',
        role: 'Web3 developer',
        image: avatarImage2,
      },
    },
  ],
  [
    {
      content:
        '"I am not a technical person but luckily web3 is not all about coding. Chat me up in discord and lets talk."',
      member: {
        name: 'Hien',
        role: 'Content manager',
        image: avatarImage3,
      },
    },
  ],
]

export function MeetUs() {
  return (
    <section
      id="team"
      aria-label="What our customers are saying"
      className="bg-slate-50 py-20 sm:py-32"
    >
      <div className="mx-auto max-w-2xl px-2 md:text-center">
        <h2 className=" text-3xl tracking-tight text-slate-900 sm:text-4xl">
          <span className="font-cinzel text-3xl font-bold text-slate-800 sm:text-4xl">
            Meet our team
          </span>
        </h2>
        <p className="mt-4 text-lg tracking-tight text-slate-700">
          The team behind ANNA are super talented, dedicated and passionate. If
          you share the same ambitions, check out the career section or contact
          us about open vacancies.
        </p>
      </div>
      <ul
        role="list"
        className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
      >
        {team.map((column, columnIndex) => (
          <li key={columnIndex}>
            <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
              {column.map((team, teamIndex) => (
                <li key={teamIndex}>
                  <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                    <p className="text-lg italic tracking-tight text-slate-900">
                      {team.content}
                    </p>

                    <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <div className="font-display text-base text-slate-900">
                          {team.member.name}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {team.member.role}
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-full bg-slate-50">
                        <Image
                          className="h-14 w-14 object-cover"
                          src={team.member.image}
                          alt=""
                          width={56}
                          height={56}
                        />
                      </div>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}

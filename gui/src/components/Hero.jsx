import { Carousel } from './Carousel'
import { useRouter } from 'next/router'

import { Button } from '@/components/Button'

export function Hero() {
  const router = useRouter()
  return (
    <>
      <div className="grid h-screen items-center bg-[url('../images/background/6.jpeg')] bg-cover text-center shadow-[0px_0px_10px_5px_#805ad5] lg:pt-32">
        <div className="place-self-top mt-36 grid justify-center  bg-gray-700/80 py-2">
          <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-white sm:text-7xl ">
            A life{' '}
            <span className="relative whitespace-nowrap">
              <span className="relative inline-block bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text font-elsie text-transparent ">
                simulator{' '}
              </span>
            </span>
            <span> game to learn DeFi </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-white">
            Complete quests to earn ANNA, then stake these to earn LOVE. The
            first user to get 10k LOVE claims ownership of this game.{' '}
          </p>

          <div className="mt-10 flex justify-center gap-x-6">
            <Button href="Dashboard">Open Dashboard</Button>
            <Button
              href="https://twitter.com/_anna_defi/status/1612889267247751168"
              variant="outline"
            >
              <span className="ml-3 text-white"> Watch video </span>
            </Button>
          </div>
        </div>
        <div className="w-screen">
          <Carousel />
        </div>
      </div>
    </>
  )
}

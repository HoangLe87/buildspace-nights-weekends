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
            DeFi to{' '}
            <span className="relative whitespace-nowrap">
              <span className="relative inline-block bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text font-elsie text-transparent ">
                ANNA's{' '}
              </span>
            </span>
            <span> heart</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-white">
            With 10k LOVE tokens, ANNA is truly yours. Claim ownership of the
            entire ecosystem with just one click from the{' '}
            <span
              className="bg-gradient-to-br from-pink-400 to-red-600 bg-clip-text font-extrabold text-transparent hover:cursor-pointer"
              onClick={() => router.push('Dashboard')}
            >
              Dashboard
            </span>
          </p>

          <div className="mt-10 flex justify-center gap-x-6">
            <Button href="">Documentation</Button>
            <Button
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              variant="outline"
            >
              <span className="ml-3 text-white">Watch video</span>
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

import Carousel from './Carousel'

import { Button } from '@/components/Button'

export function Hero() {
  return (
    <>
      <div className="pt-20 pb-16 text-center lg:pt-32 ">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl ">
          DeFi to{' '}
          <span className="relative whitespace-nowrap">
            <span className="relative inline-block bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text font-elsie text-transparent ">
              ANNA's{' '}
            </span>
          </span>
          <span> heart</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          With just 10k LOVE tokens, ANNA is truly yours. Claim ownership of the
          entire ecosystem including all rights and profits.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Button href="">Documentation</Button>
          <Button
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            variant="outline"
          >
            <span className="ml-3">Watch video</span>
          </Button>
        </div>
        <div className="mt-36 flex flex-col items-center justify-center lg:mt-44">
          <p className="font-medium text-slate-900">
            There will be only one champion. Do you have what it takes to win?
          </p>
        </div>

        <Carousel />
      </div>
    </>
  )
}

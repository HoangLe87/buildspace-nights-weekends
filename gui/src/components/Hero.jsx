import Image from 'next/image'
import hero from '../images/hero.png'
import herobg from '../images/nnneon.svg'

import { Button } from '@/components/Button'

export function Hero() {
  return (
    <div className="pt-20 pb-16 text-center lg:pt-32 ">
      <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl ">
        Meet{' '}
        <span className="relative whitespace-nowrap text-blue-600">
          <span className="relative">ANNA.</span>
        </span>{' '}
        DeFi made fun and simple
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
        Obtain just 10k gANNA tokens to claim ownerhip of the entire ANNA
        ecosystem.
      </p>
      <div className="mt-10 flex justify-center gap-x-6">
        <Button href="/register">Connect Wallet</Button>
        <Button
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          variant="outline"
        >
          <span className="ml-3">Watch video</span>
        </Button>
      </div>
      <div className="mt-36 flex flex-col items-center justify-center bg-[url('../images/nnneon.svg')] bg-center bg-no-repeat lg:mt-44">
        <p className="font-medium text-slate-900">
          Do you have what it takes to win ANNA's heart?
        </p>
        <Image src={hero} className="h-52 w-52 rounded-full" alt="" />
      </div>
    </div>
  )
}

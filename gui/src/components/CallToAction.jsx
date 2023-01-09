import Image from 'next/image'

import { Button } from '@/components/Button'
import backgroundImage from '@/images/background-call-to-action.jpg'

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <div className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Invest today
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Buy ANNA and start earning LOVE. It's that simple. What's your
            excuse?
          </p>
          <Button
            href="/Anna"
            color="white"
            className="mt-10 shadow-[0px_0px_5px_3px_#B794F4] hover:shadow-[0px_0px_10px_5px_#805AD5]"
          >
            Buy ANNA
          </Button>
        </div>
      </div>
    </section>
  )
}

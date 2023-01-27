import { Carousel } from './Carousel'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from '@/components/reusable/Button'
import { TypeAnimation } from 'react-type-animation'

export function Hero() {
  return (
    <>
      <div className="grid h-screen items-center bg-[url('../images/background/6.jpeg')] bg-cover text-center shadow-[0px_0px_10px_5px_#805ad5] lg:pt-32">
        <ToastContainer position="top-right" />
        <div className="place-self-top mt-36 grid justify-center  bg-gray-700/80 py-2">
          <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-white sm:text-7xl ">
            A life simulator{' '}
            <span className="relative whitespace-nowrap">
              <span className="relative inline-block text-orange-400 ">
                game{' '}
              </span>
            </span>
            <TypeAnimation
              sequence={[
                'to learn DeFi',
                1000,
                'to earn ANNA',
                2000,
                'to claim LOVE',
                20000,
              ]}
              wrapper="div"
              cursor={true}
              repeat={Infinity}
              speed={10}
            />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-white">
            Complete quests to earn ANNA. Stake them to earn LOVE. The first
            user to get 10k LOVE claims ownership of this game.{' '}
          </p>

          <div className="mt-10 flex justify-center gap-x-6">
            <Button className="rounded-xl px-8 shadow-[0px_0px_5px_3px_#B794F4] hover:shadow-[0px_0px_10px_5px_#805AD5]">
              <span> Get a Tour </span>
            </Button>

            <Button
              href="https://twitter.com/_anna_defi/status/1612889267247751168"
              variant="outline"
            >
              <span className="ml-3 px-2 text-white"> Watch video </span>
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

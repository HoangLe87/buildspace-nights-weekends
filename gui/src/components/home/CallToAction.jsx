import { Button } from '@/components/reusable/Button'

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative grid h-screen items-center overflow-hidden bg-blue-600 bg-[url('../images/background/1.jpeg')] bg-cover shadow-[0px_0px_10px_5px_#805ad5]"
    >
      <div className="relative bg-gray-700/80 py-2 text-center shadow-[0px_0px_10px_5px_#805ad5]">
        <div className="mx-auto max-w-lg rounded-xl">
          <h2 className="rounded-xl bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text text-3xl tracking-tight text-transparent  sm:text-4xl ">
            Invest today
          </h2>
          <p className="text-bold mt-4 rounded-xl text-lg tracking-tight text-white">
            Buy ANNA and start earning LOVE. It's that simple. What's your
            excuse?
          </p>
        </div>
        <Button
          href="/Anna"
          color="white"
          className="mt-10 shadow-[0px_0px_5px_3px_#B794F4] hover:shadow-[0px_0px_10px_5px_#805AD5]"
        >
          Buy ANNA
        </Button>
      </div>
    </section>
  )
}

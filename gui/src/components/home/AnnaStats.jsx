export const AnnaStats = () => {
  return (
    <div className="grid h-screen w-full items-center text-center">
      <div className="grid gap-3">
        <h1 className="font-cinzel text-3xl font-bold text-slate-800 sm:text-4xl">
          Stake ANNA to earn LOVE
        </h1>
        Learn web3, enjoy digital art, grow your assets and most importantly
        have fun at the same time! There will be only one champion.
        <div>Do you have what it takes to win?</div>
        <div className="rounded-xl bg-slate-900 p-5 text-white">
          <div className="grid grid-cols-3 items-center gap-10 text-white">
            <div className="flex flex-col items-center py-10 text-center text-xs font-bold xl:px-10 xl:text-left">
              <div className="bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text text-transparent">
                Total locked:
              </div>{' '}
              <div className="text-sm sm:text-2xl">1k</div>
            </div>
            <div className=" flex flex-col items-center py-10   text-center text-xs font-bold xl:px-10 xl:text-left">
              <div className="bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text text-transparent">
                ANNA Market cap:{' '}
              </div>
              <div className="text-sm sm:text-2xl">2k</div>
            </div>
            <div className=" flex flex-col items-center py-10  text-center text-xs font-bold xl:px-10 xl:text-left">
              <div className="bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text text-transparent">
                Current owner:{' '}
              </div>
              <div className="text-sm sm:text-2xl">Anna.eth</div>
            </div>
          </div>
          <div className="mt-2 font-bold">Top 5</div>
          <ul className="m-auto mt-2 rounded-xl border border-solid border-slate-400 text-white">
            <li className="flex justify-center">
              <div className="w-40 overflow-hidden">
                0x45a7ff4990f858f851a2fdb67b72f47945ffe551
              </div>
              : 1.1 LOVE
            </li>
            <li className="flex justify-center">
              <div className="w-40 overflow-hidden">
                0x4cee6b545906e927ea1f9f2f271f7db7e41328d9
              </div>
              : 0.7 LOVE
            </li>
            <li className="flex justify-center">
              <div className="w-40 overflow-hidden">
                0x6b0b607951fd708ACc9836e90D15D4331c0d61e9
              </div>
              : 0.3 LOVE
            </li>
            <li className="flex justify-center">
              <div className="w-40 overflow-hidden">
                0xbAd23F5E81049a4d5b74097Cf5d00db92574995a
              </div>
              : 0.1 LOVE
            </li>
            <li className="flex justify-center">
              <div className="w-40 overflow-hidden">
                0x84A4d6fc25431F1C7bd21799464FC0f98985377a
              </div>
              : 0.1 LOVE
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

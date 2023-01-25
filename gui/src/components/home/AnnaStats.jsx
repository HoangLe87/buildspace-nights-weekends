import CountUp from 'react-countup'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'

export const AnnaStats = () => {
  const formatter = (value, duration) => (
    <CountUp end={value} duration={duration} separator="," />
  )
  return (
    <div className="mt-20 grid h-screen w-full items-center text-center">
      <div className="grid gap-3">
        <h1 className="font-cinzel text-3xl font-bold text-slate-800 sm:text-4xl">
          Stake ANNA to earn LOVE
        </h1>
        Learn web3, enjoy digital art, grow your assets and most importantly
        have fun at the same time! There will be only one champion.
        <div>Do you have what it takes to win?</div>
        <div className="rounded-xl p-5 text-slate-900">
          <div className="grid grid-cols-3 items-center gap-10 text-white">
            <div className="flex flex-col items-center py-10 text-center text-xs font-bold xl:px-10 xl:text-left">
              <Statistic
                title="Total locked"
                formatter={() => formatter(1000, 2)}
                prefix="$"
                valueStyle={{ color: '#0f172a' }}
              />
            </div>
            <div className=" flex flex-col items-center py-10   text-center text-xs font-bold xl:px-10 xl:text-left">
              <Statistic
                title="Market Cap"
                valueStyle={{ color: '#0f172a' }}
                prefix="$"
                formatter={() => formatter(2000, 4)}
              />
            </div>
            <div className=" flex flex-col items-center py-10  text-center text-xs font-bold xl:px-10 xl:text-left">
              <Statistic
                title="Current owner"
                valueStyle={{ color: '#0f172a' }}
                value={'Anna.eth'}
              />
            </div>
          </div>
          <div className="mt-2 font-bold text-slate-600">Top 5</div>
          <ul className="m-auto mt-2 rounded-xl border border-solid border-slate-400 text-slate-600">
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

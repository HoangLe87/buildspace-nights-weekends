import Binance from 'binance-api-node'

export default async function BTC(req, res) {
  try {
    if (req.method === 'GET') {
      const client = Binance()
      const data = [['time', 'low', 'open', 'close', 'high']]
      const candles = await client.candles({
        symbol: 'BTCUSDT',
        interval: '1d',
        limit: '15',
      })
      for (let i = 0; i < 15; i++) {
        let time = new Date(candles[i].openTime)
        data.push([
          `${time.getDate()}/${time.getMonth() + 1}`,
          Number(candles[i].low),
          Number(candles[i].open),
          Number(candles[i].close),
          Number(candles[i].high),
        ])
      }
      return res.status(200).json(data)
    }
  } catch (error) {
    return res.status(400).send('Unavailable')
  }
}

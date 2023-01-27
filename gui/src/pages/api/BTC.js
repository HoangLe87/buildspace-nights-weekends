import axios from 'axios'

export default async function BTC(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await axios.get(
        'https://api.binance.us/api/v3/klines?interval=1d&symbol=BTCUSDT&limit=15'
      )
      const candles = result.data
      const data = [['time', 'low', 'open', 'close', 'high']]
      for (let i = 0; i < 15; i++) {
        let time = new Date(candles[i][0])
        data.push([
          `${time.getDate()}/${time.getMonth() + 1}`,
          Number(candles[i][3]),
          Number(candles[i][1]),
          Number(candles[i][4]),
          Number(candles[i][2]),
        ])
      }
      return res.status(200).json(data)
    }
  } catch (error) {
    return res.status(400).json(error)
  }
}

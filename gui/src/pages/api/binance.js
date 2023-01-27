import Binance from 'binance-api-node'

export default async function login(req, res) {
  const required = ['BTCUSDT', 'ETHUSDT', 'LINKUSDT', 'BNBUSDT', 'LTCUSDT']
  const client = Binance()
  const data = []
  const BTC = await client.prices() // get all prices
  for (let i = 0; i < required.length; i++) {
    data.push({ symbol: required[i], price: BTC[required[i]] })
  }
  return res.status(200).json(data)
}

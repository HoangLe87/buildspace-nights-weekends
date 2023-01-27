import Binance from 'binance-api-node'

export default async function Home(req, res) {
  try {
    const client = Binance()

    const BTC = await client.prices() // get all prices
    return res.status(200).json(BTC)
  } catch (error) {
    return res.status(400).json(error)
  }
}

import Binance from 'binance-api-node'
import initializeFirebaseClient from '../../../firebase/firebaseConfig'

export default async function login(req, res) {
  console.log(req.method)
  try {
    if (req.method === 'GET') {
      const required = ['BTCUSDT']
      const client = Binance()
      const data = []
      const BTC = await client.prices() // get all prices

      for (let i = 0; i < required.length; i++) {
        data.push({ symbol: required[i], price: BTC[required[i]] })
      }
      return res.status(200).json(data)
    }
    if (req.method === 'POST') {
      return res.status(200).json('POST')
    }
  } catch (error) {
    return res.status(200).json('Unavailable')
  }
}

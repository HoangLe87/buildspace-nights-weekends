import axios from 'axios'

export default async function PriceBTC(req, res) {
  try {
    const prices = await axios.get(
      'https://api.binance.us/api/v3/ticker/price?symbol=BTCUSDT'
    )
    if (req.method === 'GET') {
      return res.status(200).json(prices.data)
    }
    if (req.method === 'POST') {
      const amount = req.body.amount
      const action = req.body.action
      const token = req.body.token
      const { adminDb, adminAuth } = initializeFirebaseServer()
      const decodedToken = await adminAuth.verifyIdToken(token)
      const email = decodedToken.email
      console.log('decodedToken', decodedToken)
      const { db, auth } = initializeFirebaseClient()
      const usersRef = doc(db, 'Users', email)
      console.log('2')
      getDoc(usersRef).then((doc) => {
        if (doc.exists()) {
          setDoc(
            usersRef,
            {
              BTCUSDT: amount,
            },
            { merge: true }
          )
        }
      })
      return res.status(200).json('POST')
    }
  } catch (error) {
    return res.status(400).json(error)
  }
}

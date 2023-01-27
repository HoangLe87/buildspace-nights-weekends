import Binance from 'binance-api-node'
import initializeFirebaseClient from '../../../firebase/firebaseConfig'
import initializeFirebaseServer from '../../../firebase/firebaseAdmin'
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore'

export default async function login(req, res) {
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
    return res.status(200).json('Unavailable')
  }
}

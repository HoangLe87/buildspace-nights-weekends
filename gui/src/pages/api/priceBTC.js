import axios from 'axios'
import initializeFirebaseClient from '../../../firebase/firebaseConfig'
import initializeFirebaseServer from '../../../firebase/firebaseAdmin'
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import anna from '../../../public/static/anna.json'

export default async function PriceBTC(req, res) {
  try {
    const prices = await axios.get(
      'https://api.binance.us/api/v3/ticker/price?symbol=BTCUSDT'
    )
    if (req.method === 'GET') {
      return res.status(200).json(prices.data)
    }
    if (req.method === 'POST') {
      const amount = Number(req.body.amount)
      const action = req.body.action
      const token = req.body.token
      const { adminDb, adminAuth } = initializeFirebaseServer()
      const decodedToken = await adminAuth.verifyIdToken(token)
      const email = decodedToken.email
      const { db, auth } = initializeFirebaseClient()
      const usersRef = doc(db, 'Users', email)
      const docSnap = await getDoc(usersRef)
      let updatedBTC = 0
      let updatedPrice = 0

      if (docSnap.exists()) {
        const data = docSnap.data()
        const holdingBTC = Number(data.BTCUSDT)
        const holdingPrice = Number(data.price)
        const cfdEntry = Number(data.cfdEntry)
        const address = Number(data.address)
        if (Date.now() < cfdEntry + 3600000) {
          return res.status(400).json('Your contract is still running')
        } else if (Date.now() >= cfdEntry + 3600000) {
          if (holdingPrice < prices.data.price && holdingBTC > 0) {
            // won
            getDoc(usersRef).then((doc) => {
              if (doc.exists()) {
                setDoc(
                  usersRef,
                  {
                    BTCUSDT: 0,
                    price: 0,
                    cfdEntry: 0,
                  },
                  { merge: true }
                )
              }
            })
          }
          if (holdingPrice > prices.data.price && holdingBTC < 0) {
            // won
            // pay
            getDoc(usersRef).then((doc) => {
              if (doc.exists()) {
                setDoc(
                  usersRef,
                  {
                    BTCUSDT: 0,
                    price: 0,
                    cfdEntry: 0,
                  },
                  { merge: true }
                )
              }
            })
          }

          if (
            (holdingPrice <= prices.data.price && holdingBTC <= 0) ||
            (holdingPrice >= prices.data.price && holdingBTC >= 0)
          ) {
            getDoc(usersRef).then((doc) => {
              if (doc.exists()) {
                setDoc(
                  usersRef,
                  {
                    BTCUSDT: 0,
                    price: 0,
                    cfdEntry: 0,
                  },
                  { merge: true }
                )
              }
            })
          }
        }
        if (action == 'buy' && holdingBTC === 0) {
          updatedPrice = prices.data.price
          updatedBTC = amount
        } else if (action == 'sell' && holdingBTC === 0) {
          updatedPrice = prices.data.price
          updatedBTC = -amount
        }
      } else {
        return res.status(400).json('Unknown user')
      }
      getDoc(usersRef).then((doc) => {
        if (doc.exists()) {
          setDoc(
            usersRef,
            {
              BTCUSDT: updatedBTC,
              price: updatedPrice,
              cfdEntry: Date.now(),
            },
            { merge: true }
          )
        }
      })
      return res.status(200).json('Transaction successful')
    }
  } catch (error) {
    return res.status(400).json(error)
  }
}

import initializeFirebaseServer from '../../../../firebase/firebaseAdmin'
import { NextResponse } from 'next/server'

export default async function login(req, res) {
  const reqMethod = req.method
  const token = req.body
  const { db, auth } = initializeFirebaseServer()
  try {
    if (reqMethod == 'POST') {
      const meta = await auth.verifyIdToken(token)
      const user = meta.uid
      res.setHeader(
        'set-cookie',
        `JWT=${token}; path=/; samesite=lax; httponly;`
      )
      return res.status(200).json(user)
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send('Unauthorised')
  }
}

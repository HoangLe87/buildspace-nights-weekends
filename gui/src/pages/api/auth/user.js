import initializeFirebaseServer from '../../../../firebase/firebaseAdmin'
import { NextResponse } from 'next/server'

export default async function user(req, res) {
  const reqMethod = req.method
  const token = req.body
  const expiresIn = 3000000
  const { db, auth } = initializeFirebaseServer()
  try {
    if (reqMethod == 'POST') {
      const meta = await auth.verifyIdToken(token)
      const user = meta.uid

      if (new Date().getTime() / 1000 - meta.auth_time < 45 * 60) {
        // Create session cookie and set it.

        const sessionCookie = await auth.createSessionCookie(token, {
          expiresIn,
        })
        const options = { maxAge: expiresIn, httpOnly: true, secure: true }
        /* res.setHeader(
          'Set-Cookie',
          `session=${sessionCookie}`,
          'httpOnly; Max-Age=60'
        )
        */

        res.setHeader(
          'set-cookie',
          `JWT=${sessionCookie}; path=/; samesite=lax; httponly;`
        )

        console.log('res', res.cookies)
        return res.end(JSON.stringify({ status: 'success' }))
      }
      // A user that was not recently signed in is trying to set a session cookie.
      // To guard against ID token theft, require re-authentication.
      res.status(401).send('Recent sign in required!')
      //return res.status(200).json(user)
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send('Unauthorised')
  }
}

import initializeFirebaseServer from '../../../../firebase/firebaseAdmin'

export default async function user(req, res) {
  const reqMethod = req.method
  const token = req.body
  console.log('token', token)
  const expiresIn = 3000000
  const { db, auth } = initializeFirebaseServer()
  try {
    if (reqMethod == 'POST') {
      const meta = await auth.verifyIdToken(token)
      const user = meta.uid

      if (new Date().getTime() / 1000 - meta.auth_time < 45 * 60) {
        const sessionCookie = await auth.createSessionCookie(token, {
          expiresIn,
        })

        res.setHeader(
          'set-cookie',
          `JWT=${sessionCookie}; path=/; samesite=lax; httponly;`
        )
        return res.end(JSON.stringify({ status: 'success' }))
      }
      res.status(401).send('Recent sign in required!')
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send('Unauthorised')
  }
}

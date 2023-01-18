export default async function user(req, res) {
  const reqMethod = req.method
  try {
    res.setHeader(
      'set-cookie',
      `JWT=deleted; path=/; samesite=lax; Max-Age=0; httponly;`
    )

    console.log('res', res.cookies)
    return res.end(JSON.stringify({ status: 'success' }))
    // A user that was not recently signed in is trying to set a session cookie.
    // To guard against ID token theft, require re-authentication
    //return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.status(400).send('Unauthorised')
  }
}

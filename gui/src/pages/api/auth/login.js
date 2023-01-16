import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import initializeFirebaseServer from '../../../../firebase/firebaseAdmin'

export default async function login(req, res) {
  const loginPayload = req.body.payload
  const domain = 'anna-defi.com'

  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.ADMIN_PRIVATE_KEY,
    'goerli'
  )

  let address
  try {
    address = sdk.auth.verify(domain, loginPayload)
  } catch (err) {
    console.error(err)
    return res.status(401).send('Unauthorized')
  }

  const { auth } = initializeFirebaseServer()

  const token = await auth.createCustomToken(address)
  return res.status(200).json({ token })
}

import { ConnectWallet, useAddress, useSDK } from '@thirdweb-dev/react'
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore'
import { signInWithCustomToken } from 'firebase/auth'
import initializeFirebaseClient from '../../../firebase/firebaseConfig'

export default function SingIn() {
  const address = useAddress()
  const sdk = useSDK()
  const { db, auth } = initializeFirebaseClient()

  const singIn = async () => {
    const payload = await sdk?.auth.login('anna-defi.com')

    const res = await fetch('api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload }),
    })

    const { token } = await res.json()

    signInWithCustomToken(auth, token)
      .then((userCredential) => {
        const user = userCredential.user
        const usersRef = doc(db, 'Users', user.uid)
        getDoc(usersRef).then((doc) => {
          if (!doc.exists()) {
            // User now has permission to update their own document outlined in the Firestore rules.
            setDoc(
              usersRef,
              { address: user.uid, level: 1, createdAt: serverTimestamp() },
              { merge: true }
            )
          }
        })
      })
      .catch((error) => {
        console.log(error)
      })
    console.log(token)
  }
  return (
    <div>
      {address ? (
        <button onClick={() => singIn()}>Sing in with ethereum</button>
      ) : (
        <ConnectWallet />
      )}
    </div>
  )
}

import { useAddress, useSDK } from '@thirdweb-dev/react'
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore'
import { signInWithCustomToken } from 'firebase/auth'
import initializeFirebaseClient from '../../firebase/firebaseConfig'
import { Button } from '@/components/Button'
import { ConnectWallet } from '@thirdweb-dev/react'

export function SingIn() {
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
    setIsSignedIn(true)
  }
  return (
    <div>
      {address ? (
        <Button color="gradient" onClick={() => singIn()}>
          <span className="w-24 max-w-xs overflow-hidden px-1">Sing In</span>
        </Button>
      ) : (
        <ConnectWallet />
      )}
    </div>
  )
}

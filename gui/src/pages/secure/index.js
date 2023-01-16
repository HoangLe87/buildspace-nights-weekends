import jwt from 'jsonwebtoken'
import { getAuth } from 'firebase/auth'
import initializeFirebaseClient from '../../../firebase/firebaseConfig'
import {
  getDocs,
  collection,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { useEffect } from 'react'

export default function Secure({ user }) {
  const auth = getAuth()

  const checkUser = async () => {
    try {
      const user = auth.currentUser.uid
      console.log(user)
      const { db, authServer } = initializeFirebaseClient()
      // uploads accounts data to firestore
      console.log('connecting to DB')
      const docRef = doc(db, 'Users', user)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        console.log(docSnap.data())
      } else {
        // doc.data() will be undefined in this case
        console.log('unknown')
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  return <div> Restricted access {user}</div>

  /* if (!auth.currentUser) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }*/
}

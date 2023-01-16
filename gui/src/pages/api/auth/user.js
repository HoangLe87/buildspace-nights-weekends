import initializeFirebaseServer from '../../../../firebase/firebaseAdmin'
import initializeFirebaseClient from '../../../../firebase/firebaseConfig'
import {
  getDocs,
  collection,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore'

export default async function login(req, res) {
  const user = req.body
  const { db, authServer } = initializeFirebaseClient()
  const { authAdmin } = initializeFirebaseServer()
  try {
    // uploads accounts data to firestore
    console.log('connecting to DB')
    const docRef = doc(db, 'Users', user)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return res.status(200).json(docSnap.data())
    } else {
      // doc.data() will be undefined in this case
      return res.status(401).send('Unauthorized')
    }
  } catch (err) {
    console.error(err)
    return res.status(401).send('Unauthorized')
  }
}

import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../../firebase/firebaseConfig'

export function User({ user }) {
  return <p>Hello, {user}!</p>
}

/*export async function getServerSideProps(context) {
  const users = await getDocs(collection(db, 'Users'))
  return users
}*/

export default async function handler(req, res) {
  let collectionData = []
  console.log('collectionData1', collectionData)
  if (collectionData.length === 0) {
    console.log('fetching')
    const users = await getDocs(collection(db, 'Users'))
    users.forEach((doc) => {
      collectionData.push({
        user: doc.data().address,
        level: doc.data().level,
      })
    })
  }
  console.log('collectionData2', collectionData)
  res.status(200).json(collectionData)
}

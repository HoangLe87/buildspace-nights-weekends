import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useState, useEffect } from 'react'

export const useFetchAllFirestoreData = (collectionName) => {
  const [allData, setAllData] = useState([])
  let collectionData = []
  let uniqueIds = []
  const fetch = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName))
    querySnapshot.forEach((doc) => {
      if (!uniqueIds.includes(doc.id)) collectionData.push(doc.data())
      uniqueIds.push(doc.id)
    })
    setAllData(collectionData)
  }
  useEffect(() => {
    fetch(collectionName)
  }, [])
  return [allData, setAllData]
}

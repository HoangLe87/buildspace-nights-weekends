import { getDocs, collection, setDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useState, useEffect } from 'react'

// fetches all data from firestore
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
  }, [allData])
  return [allData, setAllData]
}

// uploads pairs data to firestore
export const submitDataToFireStore = async (id, token1, token2) => {
  if (id) {
    await setDoc(doc(db, 'LiquidityPools', `${token1}-${token2}`), {
      pair: `${token1}-${token2}`,
      address: id,
      token1: token1,
      token2: token2,
    })
  }
}

// delete data from firestore
export const deleteDataFromFireStore = async (isDone, token1, token2) => {
  if (isDone) {
    await deleteDoc(doc(db, 'LiquidityPools', `${token1}-${token2}`))
  }
}

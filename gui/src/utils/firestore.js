import {
  getDocs,
  collection,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore'
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
  }, [])
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

// uploads accounts data to firestore
export const checkIdExistsAndCreate = async (account) => {
  const docRef = doc(db, 'Users', account)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    const userRef = collection(db, 'Users')
    await setDoc(doc(userRef, account), {
      address: account,
      level: '1',
      timestamp: serverTimestamp(),
    })
  }
}

// delete data from firestore
export const deleteDataFromFireStore = async (isDone, token1, token2) => {
  if (isDone) {
    await deleteDoc(doc(db, 'LiquidityPools', `${token1}-${token2}`))
  }
}

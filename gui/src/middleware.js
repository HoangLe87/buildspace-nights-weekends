import { NextResponse, NextRequest } from 'next/server'
import { getDocs, collection } from 'firebase/firestore'
//import initializeFirebaseServer from '../firebase/firebaseAdmin'

export default async function middleware(req, res) {
  /*const JWT = req.cookies.get('JWT') | ''
  console.log('JWT', JWT)
  const { auth } = initializeFirebaseServer()
  const meta = await auth.verifyIdToken(JWT)
  const user = meta.uid
  console.log('user', user)
  /*
  const { auth } = initializeFirebaseServer()
  const meta = await auth.verifyIdToken(JWT)
  console.log(meta)
  const user = meta.uid
  console.log('cookie', user)
  const data = await fetch('api/auth/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const response = await data.json()
  console.log('response', response)*/
}

export const config = {
  matcher: ['/secure', '/'],
}

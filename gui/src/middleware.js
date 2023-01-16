import { NextResponse, NextRequest } from 'next/server'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

export async function middleware(req, res) {
  if (req.nextUrl.pathname === '/secure') {
    console.log('req', req)
  }
}

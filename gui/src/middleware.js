import { NextResponse, NextRequest } from 'next/server'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

export async function middleware(request) {
  if (request.nextUrl.pathname === '/Marketplace') {
    console.log()
  }
}

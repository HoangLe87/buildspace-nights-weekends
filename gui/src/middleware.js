import { NextResponse, NextRequest } from 'next/server'
import { getDocs, collection } from 'firebase/firestore'

export default function middleware(req, res) {
  const cookie = req.cookies.get('JWT')
  if (req.nextUrl.pathname === '/secure') {
    console.log('req', req)
    console.log('cookie?:', cookie)
    console.log('cookie:', req.cookies.get('cookie'))
  }
}

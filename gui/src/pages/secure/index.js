import { getAuth } from 'firebase/auth'
import { useRouter } from 'next/router'
import initializeFirebaseServer from '../../../firebase/firebaseAdmin'
import { useAddress } from '@thirdweb-dev/react'

export async function getServerSideProps(context) {
  try {
    const JWT = context.req.cookies.JWT
    console.log('JWT', JWT)
    const { auth } = initializeFirebaseServer()
    const meta = await auth.verifySessionCookie(JWT)
    const user = meta.uid
    if (!user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
    return {
      props: { user },
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

export default function Secure({ user }) {
  const router = useRouter()
  const auth = getAuth()
  const address = useAddress()
  if (!address || !user) {
    router.push('/')
    return <div>loading...</div>
  }
  const sendApi = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const data = await fetch('api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(token),
      })
      const response = await data.json()
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {user ? (
        <div>
          {' '}
          <button onClick={sendApi}>test API</button>
          <button onClick={() => router.push('/')}>Home</button>
        </div>
      ) : (
        <>Restricted access</>
      )}{' '}
    </>
  )

  /* if (!auth.currentUser) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }*/
}

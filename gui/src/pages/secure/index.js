import { getAuth } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function Secure() {
  const router = useRouter()
  const auth = getAuth()
  const sendApi = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      console.log(token)
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
      {auth.currentUser ? (
        <div>
          {' '}
          <button onClick={sendApi}>test API</button>
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

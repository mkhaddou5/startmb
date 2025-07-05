'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      
      if (user) {
        setUser(user)
      } else {
        router.push('/auth')
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>

        {user && (
          <div className="mb-6">
            <p className="text-gray-700">Signed in as: <strong>{user.email}</strong></p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => router.push('/add')}
            className="block w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Submit a New Listing
          </button>

          <button
            onClick={handleLogout}
            className="block w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../utils/supabase/client'
import Link from 'next/link'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
      } else {
        setUser(user)
      }
    }

    fetchUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center p-4">
      {/* ✅ Clickable StartMB Logo */}
      <Link href="/" className="block text-3xl font-extrabold text-center mb-10 text-blue-600 tracking-tight">
        <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Start</span>MB
      </Link>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>

        <p className="text-sm text-gray-600">
          <span className="font-semibold">Name:</span> {user.user_metadata?.full_name || user.email}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">User ID:</span> {user.id}
        </p>

        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

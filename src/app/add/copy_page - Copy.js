// app/add/page.js
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AddPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth')  // 🔐 redirect to sign-in page
      } else {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add New Listing</h1>
      {/* your existing form code here */}
    </div>
  )
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

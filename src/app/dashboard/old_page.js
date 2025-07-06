'use client'

import { useEffect, useState } from 'react'
//import { supabase } from '@/lib/supabaseClient'
import { supabase } from '../../utils/supabase/client'; // adjust path accordingly

import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        router.push('/auth')
        return
      }

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userData.user.id)

      if (!error) {
        setListings(data)
      }
      setLoading(false)
    }

    fetchData()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

        <button
          onClick={() => router.push('/add')}
          className="mb-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Add New Listing
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-600">You have no listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-700">${item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

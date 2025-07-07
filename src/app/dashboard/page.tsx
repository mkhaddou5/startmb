'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase/client'
import Link from 'next/link'

export default function DashboardPage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const currentUser = userData?.user

      if (!currentUser) {
        router.push('/auth')
        return
      }

      setUser(currentUser)
      const fullName = currentUser.user_metadata?.full_name || currentUser.email || 'Welcome!'
      setUserName(fullName)

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (!error) {
        setListings(data || [])
      } else {
        console.error('Error loading listings:', error)
      }

      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    const { error } = await supabase.from('listings').delete().eq('id', id)

    if (error) {
      console.error('Failed to delete:', error)
      return
    }

    setListings((prev) => prev.filter((listing) => listing.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-right text-sm text-gray-600 mb-2">
          Logged in as <span className="font-semibold text-gray-800">{userName}</span>
        </div>

        <Link href="/" className="block text-3xl font-extrabold text-center mb-10 text-blue-600 tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Start</span>MB
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
          <button
            onClick={() => router.push('/add-listing')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            + Add New Listing
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-600">You have no listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {listings.map((item) => {
              const images = Array.isArray(item.images) ? item.images.slice(0, 4) : []

              return (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-md transition space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden border"
                      >
                        {images[i] ? (
                          <img src={images[i]} alt={`Property ${i + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-500">Coming soon</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Title:</span> {item.title || '—'}</p>
                  <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Price:</span> {item.price ? `$${item.price}` : '—'}</p>
                  <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Description:</span> {item.description?.length > 100 ? `${item.description.substring(0, 100)}...` : item.description || '—'}</p>
                  <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Address:</span> {item.address || '—'}</p>
                  <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Bedrooms:</span> {item.bedrooms || '—'}</p>
                  <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Bathrooms:</span> {item.bathrooms || '—'}</p>
                  <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">House Sq Ft:</span> {item.house_sqft || '—'}</p>
                  <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Lot Sq Ft:</span> {item.lot_sqft || '—'}</p>

                  <div className="flex gap-4 mt-2">
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                      onClick={() => router.push(`/edit-listing?id=${item.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-1 rounded text-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
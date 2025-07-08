'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../utils/supabase/client'

export default function PublicListingPage() {
  const { id } = useParams()
  const router = useRouter()

  const [listing, setListing] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadListing = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {
        setListing(data)
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      setLoading(false)
    }

    loadListing()
  }, [id])

  if (loading) return <div className="p-8">Loading listing...</div>
  if (!listing) return <div className="p-8 text-red-600">Listing not found.</div>

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">{listing.title}</h1>
      <p className="text-gray-600">{listing.address}</p>
      <p className="text-lg font-medium text-black">${listing.price?.toLocaleString()}</p>

      <div className="grid grid-cols-2 gap-4">
        {(listing.images || []).map((img: string, i: number) => (
          <image key={i} src={img} alt={`image-${i}`} className="rounded-lg object-cover h-48 w-full" />
        ))}
      </div>

      <div>
        <p className="font-semibold">Bedrooms:</p>
        <p>{listing.bedrooms}</p>
        <p className="font-semibold">Bathrooms:</p>
        <p>{listing.bathrooms}</p>
        <p className="font-semibold">House Sq Ft:</p>
        <p>{listing.house_sqft}</p>
        <p className="font-semibold">Lot Sq Ft:</p>
        <p>{listing.lot_sqft}</p>
      </div>

      <div>
        <p className="font-semibold mb-1">Description:</p>
        <p>{listing.description}</p>
      </div>

      {userId === listing.user_id && (
        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => router.push(`/edit-listing?id=${listing.id}`)}
        >
          Edit Listing
        </button>
      )}
    </div>
  )
}

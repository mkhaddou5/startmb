'use client'

import { useEffect, useState } from 'react'
import { supabase } from 'utils/supabase/client'
import Link from 'next/link'

export default function ListingGrid() {
  const [listings, setListings] = useState([])

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching listings:', error)
      } else {
        console.log('Fetched listings:', data)
        setListings(data)
      }
    }

    fetchListings()
  }, [])

  return (
    <div className="px-4 py-10 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Featured Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {listings.map((listing: any) => (
          <div key={listing.id} className="bg-white shadow rounded-lg overflow-hidden">
            
            {/* ✅ Robust Image Rendering with Fallback */}
            <div className="h-48 bg-gray-200">
              {Array.isArray(listing.images) &&
              listing.images.length > 0 &&
              typeof listing.images[0] === 'string' ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title || 'Listing Image'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  No Image Available
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{listing.title}</h3>
              <p className="text-sm text-gray-600">{listing.address}</p>
              <p className="text-blue-600 font-bold mt-2">
                {listing.price?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </p>
              <Link
                href={`/listing/${listing.id}`}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function HomeSearch() {
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [homes, setHomes] = useState([])

  const handleSearch = async () => {
    const res = await fetch(`/api/realtor-search?city=${city}&state=${state}`)
    const data = await res.json()
    console.log('✅ Home API:', data)
    setHomes(data || [])
  }

  return (
    <div className="mt-12 mb-24 px-4">
      <div className="max-w-6xl mx-auto border border-gray-300 rounded-lg shadow-md bg-white">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            🔍 Search Properties Outside StartMB
          </h2>
        </div>

        {/* Search Inputs */}
        <div className="flex gap-4 p-6">
          <input
            className="border p-2 rounded w-1/2"
            placeholder="City (e.g., San Jose)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            className="border p-2 rounded w-1/4"
            placeholder="State (e.g., CA)"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        {/* Results */}
        {homes.length > 0 && (
          <div className="max-h-[500px] overflow-y-auto px-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {homes.map((home: any, idx) => (
                <a
                  key={idx}
                  href={`https://www.realtor.com/realestateandhomes-detail/${home.property_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border p-2 rounded shadow hover:shadow-md transition bg-white"
                >
                  <Image
                    src={home?.photos?.[0]?.href || '/no-image.jpg'}
                    alt="home"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <p className="font-bold text-lg">
                    ${home?.list_price?.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {home?.location?.address?.line}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

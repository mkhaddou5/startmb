'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SearchPage() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [homes, setHomes] = useState([]);

  const handleSearch = async () => {
    const res = await fetch(`/api/realtor-search?city=${city}&state=${state}&type=${propertyType}`);
    const data = await res.json();
    console.log('✅ Property API response:', data);
    setHomes(data || []);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-xl font-bold text-blue-600">
          StartMB
        </Link>
        <div className="text-sm text-gray-700">Logged in</div> {/* Replace with real user UI later */}
      </div>

      {/* Search Section */}
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Find Your Dream Property</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            className="border p-2 w-full sm:w-[260px] rounded"
            placeholder="City (e.g., San Ramon)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            className="border p-2 w-1/6 rounded"
            placeholder="State (e.g., CA)"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="single_family">House</option>
            <option value="condos">Condo</option>
            <option value="townhomes">Townhome</option>
            <option value="multi_family">Multi-family</option>
            <option value="land">Land</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSearch}
          >
            Search
          </button>
          <label className="flex items-center text-sm ml-2">
            <input
              type="checkbox"
              className="mr-1"
              checked={showMap}
              onChange={() => setShowMap(!showMap)}
            />
            Map View (Coming Soon)
          </label>
        </div>

        {/* Map placeholder */}
        {showMap && (
          <div className="bg-gray-200 h-96 rounded mb-8 flex items-center justify-center text-gray-600 italic">
            Map view coming soon...
          </div>
        )}

        {/* Listings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {homes.map((home: any, idx) => (
            <Link
              key={idx}
              href={`/property?id=${home.property_id}`}
              className="border rounded-xl shadow hover:shadow-lg transition overflow-hidden block bg-white"
            >
              <image
                src={home?.photos?.[0]?.href || '/no-image.jpg'}
                alt="property"
                className="w-full h-48 object-cover mb-3"
              />
              <div className="p-4">
                <div className="font-bold text-lg mb-1 text-black">
                  ${home?.list_price?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-gray-700 text-sm">
                  {home?.location?.address?.line || 'Address not available'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

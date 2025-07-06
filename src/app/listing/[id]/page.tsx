import { supabase } from '../../../utils/supabase/client'
//import { supabase } from '@/utils/supabase/client'
import { notFound } from 'next/navigation'

export default async function ListingDetail({ params }: any) {
  const { id } = params

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Listing not found:', error?.message)
    notFound()
  }

  const {
    title,
    description,
    price,
    address,
    bedrooms,
    bathrooms,
    house_sqft,
    lot_sqft,
    images = [],
  } = data

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">{title}</h1>
        <p className="text-gray-600 mb-2">{address}</p>
        <p className="text-xl text-blue-700 font-semibold mb-6">
          {price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {images.length > 0 ? (
            images.map((url: string, idx: number) => (
              <img
                key={idx}
                src={url}
                alt={`Listing Image ${idx + 1}`}
                className="w-full h-48 object-cover rounded"
              />
            ))
          ) : (
            <p className="text-gray-400">No images uploaded</p>
          )}
        </div>

        <div className="space-y-2 text-gray-700">
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Bedrooms:</strong> {bedrooms}</p>
          <p><strong>Bathrooms:</strong> {bathrooms}</p>
          <p><strong>House Sq Ft:</strong> {house_sqft?.toLocaleString()}</p>
          <p><strong>Lot Sq Ft:</strong> {lot_sqft?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

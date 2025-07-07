// src/app/add/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase/client'

export default function AddListingPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceRaw, setPriceRaw] = useState('')
  const [address, setAddress] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [houseSqftRaw, setHouseSqftRaw] = useState('')
  const [lotSqftRaw, setLotSqftRaw] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!userId) {
      setError("User not authenticated.")
      return
    }

    const price = parseFloat(priceRaw.replace(/[^0-9.]/g, ''))
    const houseSqft = parseInt(houseSqftRaw)
    const lotSqft = parseInt(lotSqftRaw)

    let uploadedImageUrls: string[] = []

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (file) {
        const fileExt = file.name.split('.').pop()
        const filePath = `${userId}/${Date.now()}-${i}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Upload error:', uploadError.message)
          setError('Image upload failed: ' + uploadError.message)
          return
        }

        const { data: publicUrlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath)

        uploadedImageUrls.push(publicUrlData.publicUrl)
      }
    }

    const { error: insertError } = await supabase.from('listings').insert([
      {
        title,
        description,
        price,
        address,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        house_sqft: houseSqft,
        lot_sqft: lotSqft,
        user_id: userId,
        images: uploadedImageUrls,
      },
    ])

    if (insertError) {
      console.error('Insert error:', insertError.message)
      setError('Failed to add listing: ' + insertError.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Listing</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input" required />
        <input type="text" placeholder="Price" value={priceRaw} onChange={(e) => setPriceRaw(e.target.value)} className="input" required />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="input" required />
        <input type="text" placeholder="Bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="input" required />
        <input type="text" placeholder="Bathrooms" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="input" required />
        <input type="text" placeholder="House Sq Ft" value={houseSqftRaw} onChange={(e) => setHouseSqftRaw(e.target.value)} className="input" required />
        <input type="text" placeholder="Lot Sq Ft" value={lotSqftRaw} onChange={(e) => setLotSqftRaw(e.target.value)} className="input" required />
        <input type="file" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className="input" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Listing</button>
      </form>
    </div>
  )
}
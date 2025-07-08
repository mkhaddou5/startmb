'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import Link from 'next/link'

export default function EditListingInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listingId = searchParams.get('id')

  const [userName, setUserName] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    house_sqft: '',
    lot_sqft: '',
  })

  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<(File | null)[]>([null, null, null, null])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUserName(user.user_metadata?.full_name || user.email || 'User')

      if (!listingId) {
        setError('Missing listing ID')
        return
      }

      const { data, error } = await supabase.from('listings').select('*').eq('id', listingId).single()

      if (error || !data) {
        setError('Failed to load listing')
        return
      }

      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        address: data.address || '',
        bedrooms: data.bedrooms?.toString() || '',
        bathrooms: data.bathrooms?.toString() || '',
        house_sqft: data.house_sqft?.toString() || '',
        lot_sqft: data.lot_sqft?.toString() || '',
      })

      setExistingImages(data.images || [])
      setTimeout(() => autoResizeTextarea(), 0)
      setLoading(false)
    }

    fetchData()
  }, [listingId, router])

  const autoResizeTextarea = () => {
    const textarea = descriptionRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (index: number, file: File | null) => {
    const files = [...newImages]
    files[index] = file
    setNewImages(files)
  }

  const handleImageDelete = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!listingId) return

    const uploadedUrls: string[] = []

    for (let i = 0; i < newImages.length; i++) {
      const file = newImages[i]
      if (!file) continue

      const ext = file.name.split('.').pop()
      const filePath = `listing-images/${Date.now()}-${i}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file)

      if (uploadError) {
        setError('Image upload failed.')
        return
      }

      const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath)
      uploadedUrls.push(data.publicUrl)
    }

    const { error } = await supabase.from('listings').update({
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      house_sqft: parseInt(formData.house_sqft),
      lot_sqft: parseInt(formData.lot_sqft),
      images: [...existingImages, ...uploadedUrls],
    }).eq('id', listingId)

    if (error) {
      setError('Failed to update listing.')
    } else {
      router.push('/dashboard')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-right text-sm text-gray-600 mb-2">
          Logged in as <span className="font-semibold">{userName}</span>
        </div>

        <Link href="/" className="block text-3xl font-bold text-center mb-8 text-blue-600">
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Start</span>MB
        </Link>

        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-xl font-bold mb-4">Edit Listing</h1>

          {error && <p className="text-red-600">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full px-4 py-2 border rounded" required />
            <textarea ref={descriptionRef} name="description" value={formData.description} onChange={(e) => { handleChange(e); autoResizeTextarea() }} placeholder="Description" rows={4} className="w-full px-4 py-2 border rounded resize-none" required />
            <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" className="w-full px-4 py-2 border rounded" required />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full px-4 py-2 border rounded" />

            <div className="grid grid-cols-2 gap-4">
              <input name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" type="number" className="w-full px-4 py-2 border rounded" />
              <input name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" type="number" className="w-full px-4 py-2 border rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input name="house_sqft" value={formData.house_sqft} onChange={handleChange} placeholder="House Sq Ft" type="number" className="w-full px-4 py-2 border rounded" />
              <input name="lot_sqft" value={formData.lot_sqft} onChange={handleChange} placeholder="Lot Sq Ft" type="number" className="w-full px-4 py-2 border rounded" />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Existing Images</label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt={`img-${i}`} className="w-full h-32 object-cover rounded" />
                    <button type="button" onClick={() => handleImageDelete(url)} className="absolute top-1 right-1 text-xs px-2 py-1 bg-red-600 text-white rounded">Remove</button>
                  </div>
                ))}
              </div>

              <label className="block mb-2 text-sm font-medium">Add More Images</label>
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="relative">
                    <label htmlFor={`image-${i}`} className="block aspect-square border-2 border-dashed border-gray-300 rounded-md cursor-pointer overflow-hidden flex items-center justify-center bg-gray-50 hover:border-blue-400">
                      {newImages[i] ? (
                        <img src={URL.createObjectURL(newImages[i]!)} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm text-gray-500 text-center px-2">Upload Image {i + 1}</span>
                      )}
                    </label>
                    <input type="file" id={`image-${i}`} accept="image/*" className="hidden" onChange={(e) => handleImageChange(i, e.target.files?.[0] || null)} />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  )
}

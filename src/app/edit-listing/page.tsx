'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase/client'

export default function EditListingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const listingId = searchParams.get('id')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    house_sqft: '',
    lot_sqft: ''
  })
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single()

      if (error || !data) {
        console.error(error)
        setError('Failed to load listing.')
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
        lot_sqft: data.lot_sqft?.toString() || ''
      })

      setExistingImages(data.images || [])
      setLoading(false)
    }

    fetchListing()
  }, [listingId])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDeleteImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url))
  }

  // ✅ Fixed type error with "as File[]" and typed updater function
  const handleNewImageUpload = (e: any) => {
    const files = Array.from(e.target.files) as File[]
    setNewImageFiles((prev: File[]) => [...prev, ...files])
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError(null)

    const uploadedImageUrls: string[] = []

    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i]
      const fileExt = file.name.split('.').pop()
      const filePath = `listing-images/${Date.now()}-${i}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error(uploadError)
        setError('Image upload failed.')
        return
      }

      const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath)
      uploadedImageUrls.push(data.publicUrl)
    }

    const { error } = await supabase
      .from('listings')
      .update({
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        house_sqft: parseInt(formData.house_sqft),
        lot_sqft: parseInt(formData.lot_sqft),
        images: [...existingImages, ...uploadedImageUrls]
      })
      .eq('id', listingId)

    if (error) {
      console.error(error)
      setError('Failed to update listing.')
    } else {
      router.push('/dashboard')
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full px-4 py-2 border rounded"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          ref={descriptionRef}
          placeholder="Description"
          className="w-full px-4 py-2 border rounded resize-none"
          rows={4}
          required
        />

        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full px-4 py-2 border rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="Bedrooms"
            type="number"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="Bathrooms"
            type="number"
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="house_sqft"
            value={formData.house_sqft}
            onChange={handleChange}
            placeholder="House Sq Ft"
            type="number"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            name="lot_sqft"
            value={formData.lot_sqft}
            onChange={handleChange}
            placeholder="Lot Sq Ft"
            type="number"
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Current Images</label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {existingImages.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt={`Image ${i}`} className="w-full h-32 object-cover rounded" />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                  onClick={() => handleDeleteImage(url)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <label className="block font-medium mb-2">Upload More Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleNewImageUpload}
            className="mb-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddListingPage() {
  const router = useRouter()

  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceRaw, setPriceRaw] = useState('')
  const [priceFormatted, setPriceFormatted] = useState('')
  const [isPriceFocused, setIsPriceFocused] = useState(false)

  const [address, setAddress] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [houseSqftRaw, setHouseSqftRaw] = useState('')
  const [lotSqftRaw, setLotSqftRaw] = useState('')
  const [imageFiles, setImageFiles] = useState([null, null, null, null])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        setUserName(user.user_metadata?.full_name || user.email || 'Welcome!')
      } else {
        router.push('/auth')
      }
    }
    fetchUser()
  }, [router])

  const formatWholeNumber = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ''))
    if (isNaN(num)) return ''
    return num.toLocaleString()
  }

  const handleHouseSqftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    setHouseSqftRaw(raw)
  }

  const handleLotSqftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    setLotSqftRaw(raw)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setPriceRaw(value)
    setPriceFormatted('')
  }

  const handlePriceBlur = () => {
    if (priceRaw) {
      const formatted = parseFloat(priceRaw).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
      setPriceFormatted(formatted)
    }
    setIsPriceFocused(false)
  }

  const handlePriceFocus = () => {
    setIsPriceFocused(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

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
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        <div className="text-right text-sm text-gray-600 mb-2">
          Logged in as <span className="font-semibold text-gray-800">{userName}</span>
        </div>

        <Link href="/" className="block text-3xl font-extrabold text-center mb-10 text-blue-600 tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Start</span>MB
        </Link>

        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Listing</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Title" className="w-full px-4 py-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <textarea placeholder="Description" className="w-full px-4 py-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} required />

            <div className="relative">
              <input
                type="text"
                placeholder="Price"
                className="w-full px-4 py-2 border rounded"
                value={isPriceFocused ? priceRaw : priceFormatted || (priceRaw ? `$${priceRaw}` : '')}
                onChange={handlePriceChange}
                onFocus={handlePriceFocus}
                onBlur={handlePriceBlur}
                inputMode="decimal"
              />
            </div>

            <input type="text" placeholder="Address" className="w-full px-4 py-2 border rounded" value={address} onChange={(e) => setAddress(e.target.value)} />

            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Bedrooms" className="w-full px-4 py-2 border rounded" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
              <input type="number" placeholder="Bathrooms" className="w-full px-4 py-2 border rounded" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="House Sq Ft"
                className="w-full px-4 py-2 border rounded"
                value={formatWholeNumber(houseSqftRaw)}
                onChange={handleHouseSqftChange}
                inputMode="numeric"
              />
              <input
                type="text"
                placeholder="Lot Sq Ft"
                className="w-full px-4 py-2 border rounded"
                value={formatWholeNumber(lotSqftRaw)}
                onChange={handleLotSqftChange}
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Upload Images</label>
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="relative">
                    <label
                      htmlFor={`image-${index}`}
                      className="block aspect-square border-2 border-dashed border-gray-300 rounded-md cursor-pointer overflow-hidden flex items-center justify-center bg-gray-50 hover:border-blue-400"
                    >
                      {imageFiles[index] ? (
                        <img
                          src={URL.createObjectURL(imageFiles[index])}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-gray-500 text-center px-2">
                          Upload Image {index + 1}
                        </span>
                      )}
                    </label>
                    <input
                      type="file"
                      id={`image-${index}`}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const fileList = [...imageFiles]
                        fileList[index] = e.target.files?.[0] || null
                        setImageFiles(fileList)
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Each box accepts one image (up to 4).</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
              Add Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

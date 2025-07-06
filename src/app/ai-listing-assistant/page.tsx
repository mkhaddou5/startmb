'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase/client'

export default function AIListingAssistantPage() {
  const [propertyType, setPropertyType] = useState('')
  const [location, setLocation] = useState('')
  const [priceRaw, setPriceRaw] = useState('')
  const [priceFormatted, setPriceFormatted] = useState('')
  const [isPriceFocused, setIsPriceFocused] = useState(false)
  const [bedrooms, setBedrooms] = useState(1)
  const [bathrooms, setBathrooms] = useState(1)
  const [features, setFeatures] = useState('')
  const [tone, setTone] = useState('Professional')
  const [language, setLanguage] = useState('English')
  const [listingDescription, setListingDescription] = useState('')
  const [generatedTitle, setGeneratedTitle] = useState('')
  const [generatedAddress, setGeneratedAddress] = useState('')
  const [generatedPrice, setGeneratedPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email || 'Welcome!')
      } else {
        router.push('/auth')
      }
    }
    fetchUser()
  }, [router])

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (isNaN(num)) return ''
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setPriceRaw(value)
    setPriceFormatted('')
  }

  const handlePriceFocus = () => setIsPriceFocused(true)
  const handlePriceBlur = () => {
    setIsPriceFocused(false)
    if (priceRaw) setPriceFormatted(formatCurrency(priceRaw))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType,
          location,
          price: priceRaw,
          bedrooms,
          bathrooms,
          features,
          tone,
          language,
        }),
      })

      const data = await res.json()

      setGeneratedTitle(data.title)
      setListingDescription(data.description)
      setGeneratedAddress(data.address)
      setGeneratedPrice(data.price)
      setPriceRaw(data.price || '')
      setPriceFormatted(formatCurrency(data.price || ''))

      localStorage.setItem(
        'ai-listing-data',
        JSON.stringify({
          title: data.title,
          description: data.description,
          address: data.address,
          price: data.price,
          bedrooms,
          bathrooms,
        })
      )
    } catch (err) {
      console.error('Error generating listing:', err)
      setListingDescription('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Top bar with login info */}
        <div className="text-right text-sm text-gray-600 mb-2">
          Logged in as <span className="font-semibold text-gray-800">{userName}</span>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Start</span>MB
          </h1>
          <p className="text-lg mt-2 font-semibold text-gray-700">StartMB AI-Powered Listing Agent</p>
        </div>

        {/* How it works */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6 text-sm text-blue-800">
          <h2 className="text-base font-semibold mb-2">What does the StartMB AI Listing Agent do?</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Fill in your property&apos;s details below (location, features, tone, etc.)</li>
            <li>Click <strong>&quot;Generate Listing&quot;</strong> to let our AI write a professional title and description for your property</li>
            <li>We&apos;ll also estimate a price and address based on your input</li>
            <li>Once you&apos;re happy with the result, hit <strong>&quot;Next&quot;</strong> to auto-fill it into the main listing form</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md p-6 rounded-lg">
          <input
            type="text"
            placeholder="Property Type (e.g., Single Family, Condo)"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />

          <input
            type="text"
            placeholder="Location (e.g., San Ramon, CA)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />

          <input
            type="text"
            placeholder="Price"
            inputMode="decimal"
            value={
              isPriceFocused
                ? priceRaw
                : priceFormatted || (priceRaw ? `$${priceRaw}` : '')
            }
            onChange={handlePriceChange}
            onFocus={handlePriceFocus}
            onBlur={handlePriceBlur}
            className="w-full border border-gray-300 p-2 rounded-md"
          />

          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(parseInt(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
              min={0}
            />
            <input
              type="number"
              placeholder="Bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(parseFloat(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
              min={0}
            />
          </div>

          <textarea
            placeholder="Special features (pool, remodeled kitchen, etc.)"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            rows={3}
          />

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="Professional">Professional</option>
            <option value="Luxury">Luxury</option>
            <option value="Casual">Casual</option>
            <option value="Playful">Playful</option>
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Arabic">Arabic</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Generating...' : 'Generate Listing'}
          </button>
        </form>

        {/* Output */}
        {listingDescription && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-300">
            <h2 className="font-semibold mb-2 text-gray-800">Generated Listing:</h2>
            <p className="text-gray-800 font-bold">Title: {generatedTitle}</p>
            <p className="text-gray-800 font-semibold mt-2">Address: {generatedAddress}</p>
            <p className="text-gray-800 mt-2 whitespace-pre-wrap">{listingDescription}</p>
            <p className="text-gray-800 font-semibold mt-2">
              Price: {priceFormatted || (priceRaw ? `$${priceRaw}` : '')}
            </p>

            <div className="mt-6 text-center">
              <p className="text-green-700 font-medium mb-2">
                ✅ Listing data saved. You&apos;re ready to move to the next step.
              </p>
              <button
                onClick={() => router.push('/add')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md text-lg transition"
              >
                Next: Auto-Fill &amp; Review Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
// Trigger Vercel redeploy

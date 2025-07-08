'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/utils/supabase/client'

export default function AddListingPage() {
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
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
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null])
  const [error, setError] = useState<string | null>(null)

  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

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

    function preloadAIListingData() {
      const stored = localStorage.getItem('ai-listing-data')
      if (!stored) return
      try {
        const aiData = JSON.parse(stored)
        if (aiData.title) setTitle(aiData.title)
        if (aiData.description) {
          setDescription(aiData.description)
          setTimeout(() => autoResizeTextarea(), 0)
        }
        if (aiData.address) setAddress(aiData.address)
        if (aiData.price) {
          const raw = aiData.price.toString().replace(/[^0-9.]/g, '')
          setPriceRaw(raw)
          setPriceFormatted('')
        }
        if (aiData.bedrooms) setBedrooms(aiData.bedrooms.toString())
        if (aiData.bathrooms) setBathrooms(aiData.bathrooms.toString())
        localStorage.removeItem('ai-listing-data')
      } catch (e) {
        console.error('Error parsing AI listing data:', e)
      }
    }

    fetchUser()
    preloadAIListingData()
  }, [router])

  const autoResizeTextarea = () => {
    const textarea = descriptionRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const handlePriceFocus = () => {
    setIsPriceFocused(true)
  }

  const handlePriceBlur = () => {
    setIsPriceFocused(false)
    const price = parseFloat(priceRaw.replace(/[^0-9.]/g, ''))
    if (!isNaN(price)) {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price)
      setPriceFormatted(formatted)
    } else {
      setPriceFormatted('')
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRaw(e.target.value)
  }

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

    const { error: insertError } = await supabase.from('listings').insert([{
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
    }])

    if (insertError) {
      console.error('Insert error:', insertError.message)
      setError('Failed to add listing: ' + insertError.message)
    } else {
      router.push('/dashboard')
    }
  }
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const newMessages = [...messages, { role: 'user', content: chatInput }]
    setMessages(newMessages)
    setChatInput('')

    const res = await fetch('/api/chat-bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    })

    const data = await res.json()
    if (data?.reply) {
      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } else {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I couldn’t generate a response.' }])
    }
  }  // <-- ✅ THIS was missing!

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

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Want help writing your listing?</h3>
            <p className="text-sm text-blue-700 mb-3">
              Let the <strong>StartMB AI-Powered Listing Agent</strong> generate your title, description, and estimated price.
            </p>
            <button
              onClick={() => router.push('/ai-listing-assistant')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
            >
              Launch AI Listing Agent
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
            <textarea placeholder="Description" value={description} ref={descriptionRef} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded resize-none" />
            <input type="text" placeholder="Price" value={isPriceFocused ? priceRaw : priceFormatted} onFocus={handlePriceFocus} onBlur={handlePriceBlur} onChange={handlePriceChange} className="w-full border p-2 rounded" />
            <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="w-full border p-2 rounded" />

            <div className="flex gap-2">
              <input type="number" placeholder="Bedrooms" value={bedrooms} onChange={e => setBedrooms(e.target.value)} className="flex-1 border p-2 rounded" />
              <input type="number" placeholder="Bathrooms" value={bathrooms} onChange={e => setBathrooms(e.target.value)} className="flex-1 border p-2 rounded" />
            </div>

            <div className="flex gap-2">
              <input type="text" placeholder="House Sq Ft" value={houseSqftRaw} onChange={e => setHouseSqftRaw(e.target.value)} className="flex-1 border p-2 rounded" />
              <input type="text" placeholder="Lot Sq Ft" value={lotSqftRaw} onChange={e => setLotSqftRaw(e.target.value)} className="flex-1 border p-2 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="border-dashed border-2 border-gray-300 rounded h-32 flex items-center justify-center text-sm text-gray-500">
                  <label className="cursor-pointer">
                    Upload image {i + 1}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const files = [...imageFiles]
                      files[i] = e.target.files?.[0] || null
                      setImageFiles(files)
                    }} />
                  </label>
                </div>
              ))}
            </div>

            {/* Document upload placeholder */}
            <div className="border border-yellow-300 bg-yellow-50 rounded-md p-4 mt-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">📁 Upload Disclosures & Reports <span className="text-sm text-yellow-600">(Coming Soon)</span></h3>
              <p className="text-sm text-yellow-700 mb-4">{Soon you'll be able to upload important real estate documents such as:}</p>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>Property Disclosures</li>
                <li>Natural Hazard Reports</li>
                <li>Title or Deed Proof</li>
                <li>Lead Paint Disclosure</li>
                <li>HOA Rules & Docs</li>
                <li>Inspection Reports</li>
                <li>Purchase Contracts</li>
              </ul>
              <p className="mt-4 text-sm text-yellow-600 italic">This section is under development. Soon, AI will assist in reviewing them too.</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">Add Listing</button>
          </form>
        </div>
      </div>

      {/* =============================== */}
      {/* FLOATING AI CHATBOT - StartMB  */}
      {/* =============================== */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`bg-white shadow-xl border rounded-xl max-w-sm w-96 transition-all ${showChat ? 'h-[500px]' : 'h-12'} overflow-hidden`}>
          <button
            className="w-full px-4 py-3 bg-black text-white font-semibold text-sm rounded-t-xl"
            onClick={() => setShowChat(!showChat)}
          >
            {showChat ? (
              <>Close <span className="text-blue-400 font-bold">StartMB</span> AI Agent</>
            ) : (
              <>Ask <span className="text-blue-400 font-bold">StartMB</span> AI Agent</>
            )}
          </button>
          {showChat && (
            <div className="flex flex-col h-[calc(100%-48px)] p-3">
              <div className="flex-1 overflow-y-auto text-sm mb-2 space-y-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${
                      msg.role === 'user' ? 'bg-gray-200 text-right' : 'bg-blue-100 text-left'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2 mt-auto">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about disclosures..."
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

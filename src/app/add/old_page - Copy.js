'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description || !price) {
      setMessage('Please fill in all fields.')
      return
    }

    const { error } = await supabase.from('listings').insert([
      { title, description, price: parseFloat(price) }
    ])

    if (error) {
      setMessage('Error adding listing.')
      console.error(error)
    } else {
      setMessage('Listing added successfully!')
      setTitle('')
      setDescription('')
      setPrice('')
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add a New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cozy Apartment"
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something about the property..."
          />
        </div>
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 1200"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Listing
        </button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </main>
  )
}

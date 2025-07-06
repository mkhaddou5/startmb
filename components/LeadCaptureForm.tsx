'use client'
import { useState } from 'react'

export default function LeadCaptureForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Lead submitted:', email)
    setEmail('')
  }

  return (
    <section className="bg-gradient-to-r from-white to-blue-50 py-16 px-4">
      <div className="max-w-xl mx-auto text-center">
        <h4 className="text-2xl font-bold mb-4 text-gray-800">Be the First to Know</h4>
        <p className="mb-6 text-gray-600">Join our early access list and we’ll let you know when listings go live.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Notify Me
          </button>
        </form>
      </div>
    </section>
  )
}

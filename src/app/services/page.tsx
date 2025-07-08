'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ServicesPage() {
  const [showBot, setShowBot] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  const demoResponses: Record<string, string> = {
    'What documents are required to sell a home?': 'Typically, sellers need Property Disclosures, Natural Hazard Reports, and a Title or Deed proof.',
    'What is a Lead Paint Disclosure?': 'It’s a document required for homes built before 1978, disclosing any known presence of lead-based paint.',
    'Can I upload inspection reports?': 'Yes! Soon you’ll be able to upload inspection reports and get AI feedback instantly.'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* 🔷 Top Bar with Logo */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-3xl font-extrabold text-blue-600 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Start</span>MB
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">🏡 Our Real Estate Services</h1>

        {/* 🏠 Selling Services */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">For Home Sellers 🏠</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>📸 Professional Photography & Videography</li>
            <li>📝 Listing on MLS, Zillow, Redfin & Realtor</li>
            <li>🧠 AI-Powered Smart Listing Generator</li>
            <li>🏷️ Market-Driven Pricing Assistance</li>
            <li>🛠️ Pre-Listing Home Repairs & Renovation</li>
            <li>🖌️ Interior & Exterior Painting</li>
            <li>🧼 Deep Cleaning & Staging</li>
            <li>📄 Disclosure Package Preparation</li>
            <li>🧑‍⚖️ Legal Support & Escrow Coordination</li>
            <li>🚚 Moving & Storage Services</li>
          </ul>
        </div>

        {/* 🏡 Buying Services */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">For Home Buyers 🏡</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>🔍 Smart Property Search with Filters</li>
            <li>🏘️ Access to Off-Market Listings</li>
            <li>📞 Direct Communication with Sellers</li>
            <li>💼 Mortgage Pre-Approval Help</li>
            <li>🧾 Document Review & AI Guidance</li>
            <li>👷 Home Inspection Recommendations</li>
            <li>🔧 Contractor Referrals (Roofing, Plumbing, HVAC)</li>
            <li>💰 Negotiation & Offer Strategy Tips</li>
            <li>🚪 Open House Scheduling</li>
            <li>📦 Post-Sale Move-In Help</li>
          </ul>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
        </div>
      </div>

      {/* ----------------------------- AI DEMO BOT (SERVICES PAGE) ----------------------------- */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`bg-white shadow-xl border rounded-xl max-w-sm w-80 transition-all ${showBot ? 'h-auto' : 'h-12'} overflow-hidden`}>
          <button
            className="w-full px-4 py-3 bg-black text-white font-semibold text-sm rounded-t-xl"
            onClick={() => setShowBot(!showBot)}
          >
            {showBot ? 'Close StartMB AI Agent (Demo)' : 'Ask StartMB AI (Demo)'}
          </button>

          {showBot && (
            <div className="p-3 space-y-3 text-sm">
              <p className="text-gray-700 font-medium">Try a question:</p>
              {Object.keys(demoResponses).map((question) => (
                <button
                  key={question}
                  onClick={() => setSelectedQuestion(question)}
                  className="text-left w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2 py-1"
                >
                  {question}
                </button>
              ))}

              {selectedQuestion && (
                <div className="mt-2 border-t pt-2 text-gray-800">
                  <strong className="block mb-1 text-gray-600">Start<span className="text-blue-600">MB</span> AI says:</strong>
                  <p>{demoResponses[selectedQuestion]}</p>
                </div>
              )}

              <div className="pt-3">
                <Link href="/auth">
                  <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm">
                    Sign up to ask Start<span className="text-blue-200 font-bold">MB</span> AI
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* --------------------------- END AI DEMO BOT --------------------------- */}
    </div>
  )
}

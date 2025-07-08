'use client'

import Link from 'next/link'

export default function OurServicesCTA() {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 py-6 px-4 mt-[-24px] mb-[-12px]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          🛠️ Need Help with services when Buying or Selling your home?
        </h3>
        <Link
          href="/services"
          className="inline-block bg-blue-600 text-white font-semibold text-base px-5 py-2.5 rounded-full shadow-md hover:bg-blue-700 transition"
        >
          🏡 Explore Our Real Estate Services
        </Link>
      </div>
    </div>
  )
}

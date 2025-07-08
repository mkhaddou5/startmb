'use client'

import { useState } from 'react'

import Navbar from '../../components/Navbar'
import HeroSection from '../../components/HeroSection'
import HowItWorks from '../../components/HowItWorks'
import OurServicesCTA from '../../components/OurServicesCTA'
import HomeSearch from '../../components/HomeSearch'
import ListingGrid from '../../components/ListingGrid'
import LeadCaptureForm from '../../components/LeadCaptureForm'
import Footer from '../../components/Footer'
import Link from 'next/link'

export default function Home() {
  const [showBot, setShowBot] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  const demoResponses: Record<string, string> = {
    'What documents are required to sell a home?': 'Typically, sellers need Property Disclosures, Natural Hazard Reports, and a Title or Deed proof.',
    'What is a Lead Paint Disclosure?': 'It’s a document required for homes built before 1978, disclosing any known presence of lead-based paint.',
    'Can I upload inspection reports?': 'Yes! Soon you’ll be able to upload inspection reports and get AI feedback instantly.'
  }

  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorks />
	  <OurServicesCTA />
      <HomeSearch />
      <ListingGrid />
      <LeadCaptureForm />

      {/* ✅ Spacer before footer */}
      <div className="h-20 md:h-32" />
      <Footer />

      {/* ----------------------------- AI DEMO BOT (HOMEPAGE ONLY) ----------------------------- */}
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
    </main>
  )
}

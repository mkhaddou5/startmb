'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../utils/supabase/client'
import type { JSX } from 'react'  // ✅ Fix for JSX namespace error on Vercel

export default function Page(): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfoMessage('')

    let response
    if (isLogin) {
      response = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      const { error } = response
      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    } else {
      response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      const { error } = response
      if (error) {
        setError(error.message)
      } else {
        setInfoMessage(
          '✅ Please check your email for a confirmation link. Be sure to check your spam folder.'
        )
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl">

        {/* Clickable Logo */}
        <Link href="/" className="block text-3xl font-extrabold text-center mb-6 text-blue-600 tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Start</span>MB
        </Link>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {isLogin ? 'Sign In to StartMB' : 'Create Your Account'}
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Access your dashboard and manage your listings.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {infoMessage && <p className="text-green-600 text-sm">{infoMessage}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!!infoMessage}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setInfoMessage('')
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}

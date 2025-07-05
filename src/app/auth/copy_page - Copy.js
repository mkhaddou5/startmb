'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (!error) router.push('/add')
    else alert(error.message)
  }

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) router.push('/add')
    else alert(error.message)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign In / Sign Up</h2>
      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSignIn}>
          Sign In
        </button>
        <button className="bg-gray-800 text-white px-4 py-2 rounded" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  )
}

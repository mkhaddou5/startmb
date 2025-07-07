'use client'

import { useEffect } from 'react'
//import { supabase } from '../../components/SupabaseUserSync'

import { supabase } from '../lib/supabaseClient'
export default function SupabaseUserSync() {
  useEffect(() => {
    const syncUserToDB = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!data && !error) {
        await supabase.from('users').insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
          },
        ])
      }
    }

    syncUserToDB()
  }, [])

  return null
}

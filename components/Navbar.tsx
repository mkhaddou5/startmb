'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../src/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('full_name, profile_image')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setUserInfo(data);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <nav className="w-full p-4 shadow bg-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Start</span>MB
        </Link>

        {userInfo ? (
          <Link href="/dashboard/profile" className="flex items-center gap-2">
            <Image
              src={userInfo.profile_image || '/default-avatar.png'}
              alt="avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-gray-800">
              {userInfo.full_name}
            </span>
          </Link>
        ) : (
          <Link
            href="/auth"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}

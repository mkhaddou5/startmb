'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AddListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // 🔐 Check if user is logged in
  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        router.push('/auth');
      }
    }
    fetchUser();
  }, [router]);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log('Submitting listing:', {
      title,
      description,
      price: parseFloat(price),
      user_id: userId,
    });

    const { data, error: insertError } = await supabase.from('listings').insert([
      {
        title,
        description,
        price: parseFloat(price),
        user_id: userId,
      },
    ]);

    if (insertError) {
      console.error('Insert error:', insertError.message);
      setError('Failed to add listing: ' + insertError.message);
    } else {
      console.log('Listing added:', data);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Add New Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full px-4 py-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full px-4 py-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full px-4 py-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Add Listing
          </button>
        </form>
      </div>
    </div>
  );
}

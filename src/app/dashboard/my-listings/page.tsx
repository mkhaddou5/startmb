'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth');

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setListings(data);
      }

      setLoading(false);
    };

    fetchListings();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this listing?');
    if (!confirm) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete listing.');
    } else {
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Listings</h1>

      {listings.length === 0 ? (
        <p className="text-gray-600">You haven’t posted any listings yet.</p>
      ) : (
        <div className="space-y-6">
          {listings.map((listing) => (
            <div key={listing.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{listing.title}</h2>
                <span className="text-sm text-gray-500">${listing.price.toLocaleString()}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{listing.address}</p>

              <div className="flex gap-3">
                <Link
                  href={`/dashboard/my-listings/${listing.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

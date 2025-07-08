'use client';

import { useEffect, useState } from 'react';
import { supabase } from 'utils/supabase/client';
import Link from 'next/link';

export default function ListingGrid() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error);
      } else {
        setListings(data || []);
      }
    };

    fetchListings();
  }, []);

  if (listings.length === 0) return null;

  return (
    <section className="mt-20 px-4 py-10 bg-light border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-dark mb-4">Featured Listings</h2>

        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-full pb-4">
            {listings.map((listing: any) => (
              <div
                key={listing.id}
                className="flex-shrink-0 w-72 bg-white rounded-xl shadow border border-gray-200"
              >
                <div className="h-48 bg-gray-100 rounded-t-xl">
                  {Array.isArray(listing.images) &&
                  listing.images.length > 0 &&
                  typeof listing.images[0] === 'string' ? (
                    <image
                      src={listing.images[0]}
                      alt={listing.title || 'Listing Image'}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image Available
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg text-dark mb-1">
                    {listing.title || 'Untitled Listing'}
                  </h3>
                  <p className="text-sm text-secondary mb-1">{listing.address}</p>
                  <p className="text-primary font-bold mb-3">
                    {listing.price?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </p>
                  <Link
                    href={`/listing/${listing.id}`}
                    className="inline-block text-sm font-medium bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// app/property/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PropertyPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [home, setHome] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeDetails = async () => {
      if (!id) return;
      try {
        const res = await fetch(
          `https://realtor-api-for-real-estate-data.p.rapidapi.com/realtor_data/property_detail?property_id=${id}`,
          {
            headers: {
              'x-rapidapi-key': '3ff07fa9c7mshcecbbf4a0cbf5adp1cf85cjsn7f22a5940b0b',
              'x-rapidapi-host': 'realtor-api-for-real-estate-data.p.rapidapi.com',
            },
          }
        );
        const result = await res.json();

        // Some APIs wrap the object in a field like `data`
        const homeData = result?.data || result;
        setHome(homeData);
      } catch (err) {
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeDetails();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!home || Object.keys(home).length === 0)
    return <div className="p-8 text-red-600">No property data found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        ${home?.list_price?.toLocaleString() || 'N/A'}
      </h1>
      <p className="text-gray-700 mb-4">
        {home?.location?.address?.line || ''},{' '}
        {home?.location?.address?.city || ''},{' '}
        {home?.location?.address?.state_code || ''}
      </p>
      <img
        src={home?.primary_photo || home?.photos?.[0]?.href || '/no-image.jpg'}
        alt="home"
        className="w-full max-h-[400px] object-cover rounded mb-6"
      />
      <div className="space-y-2">
        <p><strong>Beds:</strong> {home?.description?.beds || 'N/A'}</p>
        <p><strong>Baths:</strong> {home?.description?.baths || 'N/A'}</p>
        <p><strong>Sq Ft:</strong> {home?.description?.sqft?.toLocaleString() || 'N/A'}</p>
        <p><strong>Year Built:</strong> {home?.description?.year_built || 'N/A'}</p>
        <p><strong>Status:</strong> {home?.status || 'N/A'}</p>
        {home?.virtual_tour_link && (
          <a
            href={home.virtual_tour_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mt-4"
          >
            View Virtual Tour
          </a>
        )}
      </div>
    </div>
  );
}

// app/api/realtor-search/route.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const state = searchParams.get('state');
  const type = searchParams.get('type'); // optional property type

  if (!city || !state) {
    return NextResponse.json({ error: 'Missing city or state' }, { status: 400 });
  }

  const baseUrl = 'https://realtor-api-for-real-estate-data.p.rapidapi.com/realtor_data/property/';
  const query = new URLSearchParams({
    city: city,
    state_code: state,
    offset: '0',
  });

  if (type) {
    query.append('prop_type', type);
  }

  const url = `${baseUrl}?${query.toString()}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '3ff07fa9c7mshcecbbf4a0cbf5adp1cf85cjsn7f22a5940b0b',
      'x-rapidapi-host': 'realtor-api-for-real-estate-data.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('✅ Property API response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch property data' }, { status: 500 });
  }
}

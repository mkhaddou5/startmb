export async function POST(req) {
  const body = await req.json();

  // Simulate saving to a database (log to console for now)
  console.log('Received lead:', body);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

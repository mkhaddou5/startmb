export async function GET() {
  return new Response(JSON.stringify({ message: 'API working!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

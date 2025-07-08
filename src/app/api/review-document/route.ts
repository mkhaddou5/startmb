import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { docType, text } = await req.json()

    if (!text || !docType) {
      return NextResponse.json({ error: 'Missing document content or type' }, { status: 400 })
    }

    const prompt = `You are a real estate compliance assistant. A seller has uploaded a document of type "${docType}". Analyze the contents and provide clear, helpful feedback to ensure it’s complete and compliant with U.S. real estate disclosure requirements. Be professional and brief.\n\nHere is the document text:\n\n${text}`

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.4,
      }),
    })

    const data = await openaiRes.json()

    const feedback = data.choices?.[0]?.message?.content || 'No feedback received.'

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('AI Review Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

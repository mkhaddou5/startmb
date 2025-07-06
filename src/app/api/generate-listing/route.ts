import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      propertyType,
      location,
      bedrooms,
      bathrooms,
      price,
      features,
      tone,
      language,
    } = body

    const basePrompt = `
Write a real estate listing in a ${tone} tone, in ${language}.
Details:
- Property Type: ${propertyType}
- Location: ${location}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Price: $${price}
- Features: ${features || 'None'}

Return only the description text (no headers or labels). Keep it persuasive and professional.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert real estate copywriter creating listings in multiple languages and tones.',
        },
        {
          role: 'user',
          content: basePrompt,
        },
      ],
      max_tokens: 400,
    })

    const description = completion.choices[0]?.message?.content || 'No description generated.'

    return NextResponse.json({
      title: `${bedrooms}-Bed ${propertyType} in ${location}`,
      description,
      address: location,
      price,
    })
  } catch (err: any) {
    console.error('AI listing generation error:', err)
    return NextResponse.json(
      { error: 'Failed to generate listing.' },
      { status: 500 }
    )
  }
}

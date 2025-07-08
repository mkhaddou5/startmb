// src/app/api/chat-bot/route.ts

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful real estate assistant. Answer questions about listing documents, disclosures, inspection reports, and provide smart advice to sellers.',
        },
        ...messages,
      ],
      temperature: 0.7,
    })

    const reply = response.choices[0]?.message?.content
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('AI Chatbot Error:', err)
    return NextResponse.json({ reply: null, error: 'Something went wrong.' }, { status: 500 })
  }
}

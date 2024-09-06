import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  baseURL: "http://127.0.0.1:5000/v1",
});

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  console.log(messages)
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      { role: 'system', content: 'You are a creative character generator. Generate characters with name, description, and personality in a text narrative format. No need to use JSON, just return the description as plain text.' },
      ...messages
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  baseURL: 'http://127.0.0.1:5000/v1',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const story = lastMessage.content.split('\n')[1]; // Get the story content

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content: "You are a professional character analysis assistant, responsible for summarizing the main characters in stories.",
        },
        {
          role: "user",
          content: `Please provide a brief summary of the characters in the following story:\n\n${story}`,
        },
      ],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in character summary generation:', error);
    return NextResponse.json({ error: 'Failed to generate character summary' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://127.0.0.1:5000/v1',
});

export async function POST(req: Request) {
  try {
    const { story } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes characters from stories.",
        },
        {
          role: "user",
          content: `Please provide a brief summary of the main characters in the following story:\n\n${story}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content;
    console.log('Summary generated:', summary);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in character summary generation:', error);
    return NextResponse.json({ error: 'Failed to generate character summary' }, { status: 500 });
  }
}

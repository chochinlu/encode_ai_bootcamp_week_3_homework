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
    const [charactersSection, storySection] = lastMessage.content.split('\n\n');
    const characters = charactersSection.replace('Characters:\n', '');
    const story = storySection.replace('Story:\n', '');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content: "You are a professional character analysis assistant, responsible for summarizing the specified characters as they appear in the given story.",
        },
        {
          role: "user",
          content: `Please provide a brief summary of how the following characters appear and develop in the given story. Only focus on these specific characters:

Characters:
${characters}

Story:
${story}

Summarize each character's role, development, and key actions in the story. Do not include characters that are not in the original character list. Provide the summary in a clear, concise format.`,
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

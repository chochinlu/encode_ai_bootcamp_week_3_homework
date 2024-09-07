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
    const [charactersSection, storySection, languageSection] = lastMessage.content.split('\n\n');
    const characters = charactersSection.replace('Characters:\n', '');
    const story = storySection.replace('Story:\n', '');
    const language = languageSection.replace('Language:\n', '');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content: "You are a professional character analysis assistant, responsible for summarizing all specified characters as they appear in the given story.",
        },
        {
          role: "user",
          content: `Please provide a brief summary of how each of the following characters appears and develops in the given story. It is crucial to include all listed characters:

Characters:
${characters}

Story:
${story}

Language:
${language}

Summarize each character's role, development, and key actions in the story. Ensure that every character from the original list is included in your summary, even if their role seems minor. If a character is not mentioned in the story, state this fact. Provide the summary in a clear, concise format, with each character's summary clearly separated.

Please respond in ${language}.`,
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

# Story Teller

Story Teller is an interactive web application that generates customized stories based on user-defined characters, genres, and tones. It leverages AI to create unique narratives and character summaries.

## Features

1. **Character Generation**: Create 1-3 characters with names, descriptions, and personalities.
2. **Character Editing**: Modify generated characters to suit your preferences.
3. **Story Customization**:
   - Choose from various genres (Fantasy, Mystery, Romance, Sci-Fi)
   - Select different tones (Happy, Sad, Sarcastic, Funny)
4. **Language Selection**: Generate stories and summaries in English or Traditional Chinese.
5. **Story Generation**: Create unique stories based on your characters, chosen genre, and tone.
6. **Character Summary**: Get an AI-generated summary of how characters appear and develop in the story.

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites

Before starting the web UI, you need to set up and run the text-generation-webui backend:

1. Clone the text-generation-webui repository:
   ```
   git clone https://github.com/oobabooga/text-generation-webui.git
   cd text-generation-webui
   ```

2. Install the requirements according to the instructions in the [text-generation-webui README](https://github.com/oobabooga/text-generation-webui).

3. Run the `start_linux.sh`, `start_windows.bat`, `start_macos.sh`, or `start_wsl.bat` script depending on your OS.
Select your GPU vendor when asked.
Once the installation ends, browse to http://localhost:7860

4. Download a model using the provided script or manually place it in the `models` folder.

5. In the web interface:
   - Load your desired model
   - Ensure the OpenAI API is enabled in the 'Session' tab

6. Once the model is loaded and the API is running, you can proceed to start the Story Teller web UI.

### Running the Web UI

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

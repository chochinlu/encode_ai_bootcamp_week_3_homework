"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "ai/react";
import { marked } from 'marked';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Chat() {
  const { messages: storyMessages, append: appendStory, isLoading: isLoadingStory } = useChat();
  const { messages: characterMessages, append: appendCharacter, isLoading: isLoadingCharacter } = useChat({ api: "/api/generate-characters" });

  const [characterCount, setCharacterCount] = useState("3");
  const [charactersText, setCharactersText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const genres = [
    { emoji: "🧙", value: "Fantasy" },
    { emoji: "🕵️", value: "Mystery" },
    { emoji: "💑", value: "Romance" },
    { emoji: "🚀", value: "Sci-Fi" },
  ];
  const tones = [
    { emoji: "😊", value: "Happy" },
    { emoji: "😢", value: "Sad" },
    { emoji: "😏", value: "Sarcastic" },
    { emoji: "😂", value: "Funny" },
  ];

  const [state, setState] = useState({
    genre: "",
    tone: "",
  });
  const [language, setLanguage] = useState("English");

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storyMessages]);

  useEffect(() => {
    if (characterMessages.length > 0) {
      setCharactersText(characterMessages[characterMessages.length - 1].content);
    }
  }, [characterMessages]);

  const generateCharacters = async () => {
    try {
      await appendCharacter({
        role: 'user',
        content: `Generate ${characterCount} characters with name, description, and personality in ${language}.`
      });
    } catch (error) {
      console.error("Error generating characters:", error);
    }
  };

  const handleEditCharacters = () => {
    setIsEditing(true);
  };

  const handleSaveCharacters = () => {
    setIsEditing(false);
    // Add save logic here if needed
  };

  // Add a new state to store the generated story
  const [generatedStory, setGeneratedStory] = useState("");

  // Add a new state to store the character summary
  const [characterSummary, setCharacterSummary] = useState("");

  // Modify the useEffect to update the generatedStory state
  useEffect(() => {
    if (storyMessages.length > 0) {
      setGeneratedStory(storyMessages[storyMessages.length - 1].content);
    }
  }, [storyMessages]);

  // Use useChat hook for character summary
  const { messages: summaryMessages, append: appendSummary, isLoading: isGeneratingSummary } = useChat({ api: "/api/character-summary" });

  // Update handleCharacterSummary function
  const handleCharacterSummary = async () => {
    if (charactersText && generatedStory) {
      await appendSummary({
        role: 'user',
        content: `Characters:\n${charactersText}\n\nStory:\n${generatedStory}`
      });
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  // Define stop function
  const stop = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      setIsGenerating(false);
    }
  }, []);

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Story Telling App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the story by selecting the genre and tone.
            </p>
          </div>

          <Select onValueChange={setLanguage} defaultValue="English">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="choose language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="繁體中文">繁體中文</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Generate Characters</h3>
            <div className="flex items-center space-x-4">
              <Select value={characterCount} onValueChange={setCharacterCount}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="character count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 character</SelectItem>
                  <SelectItem value="2">2 characters</SelectItem>
                  <SelectItem value="3">3 characters</SelectItem>
                </SelectContent>
              </Select>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                onClick={generateCharacters}
                disabled={isLoadingCharacter}
              >
                {isLoadingCharacter ? "Generating..." : "Generate Characters"}
              </button>
            </div>
            {characterMessages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Generated Characters:</h4>
                {isEditing ? (
                  <>
                    <Textarea
                      className="w-full h-64 max-w-[1024px] mx-auto"
                      value={charactersText}
                      onChange={(e) => setCharactersText(e.target.value)}
                      placeholder="edit characters"
                    />
                    <button
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      onClick={handleSaveCharacters}
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap max-w-[1024px] w-full mx-auto">
                      {charactersText || "No characters generated yet."}
                    </div>
                    <button
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      onClick={handleEditCharacters}
                    >
                      Edit Characters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>


          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Genre</h3>

            <div className="flex flex-wrap justify-center">
              {genres.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    value={value}
                    name="genre"
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Tones</h3>

            <div className="flex flex-wrap justify-center">
              {tones.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="tone"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              disabled={isLoadingStory || !state.genre || !state.tone}
              onClick={() => {
                appendStory({
                  role: 'user',
                  content: `Generate a ${state.genre} story with a ${state.tone} tone in ${language}, featuring the following characters:\n${charactersText}`
                });
              }}
            >
              Generate Story
            </button>

            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              disabled={!isGenerating}
              onClick={stop}
            >
              Stop Generation
            </button>
          </div>

          <div
            hidden={
              storyMessages.length === 0 ||
              storyMessages[storyMessages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-25 bg-gray-700 rounded-lg p-4 max-w-[1024px] w-full mx-auto"
          >
            <div dangerouslySetInnerHTML={{ __html: marked.parse(generatedStory || '') }} />
            <div ref={messageEndRef} />

            <div className="flex justify-between mt-4">
              <button
                onClick={handleCharacterSummary}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                disabled={!charactersText || isGeneratingSummary}
              >
                {isGeneratingSummary ? "Summarizing..." : "Summarize Generated Characters"}
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
              >
                Back To Top
              </button>
            </div>

            {/* Display character summary */}
            {summaryMessages.length > 0 && (
              <div className="mt-4 p-4 bg-opacity-25 bg-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Generated Characters Summary:</h4>
                {summaryMessages.slice(1).map((message, index) => (
                  <div key={index} dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
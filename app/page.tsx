import Chatbox from "@/components/chatbox/Chatbox";
import { MessageCard } from "@/components/chatbox/MessageCard";
import ModeToggle from "@/components/navbar/ModeToggle";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export default async function Home() {
  const { text } = await generateText({
    model: google("models/gemini-2.0-flash-exp"),
    prompt: "What is love?",
  });

  return (
    <div
      className="w-full font-sans grid grid-rows-[20px_1fr_20px] items-center
    justify-items-center min-h-screen gap-16 px-20 pt-5"
    >
      <header className="w-full">
        <nav className="w-full flex justify-end p-4">
          <ModeToggle />
        </nav>
      </header>
      <main className="w-full">
        <Chatbox>
          <MessageCard content={text} isUser={false} />
        </Chatbox>
      </main>
    </div>
  );
}

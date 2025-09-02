import { Chatbot } from "@/components/chatbot/Chatbot";
import ModeToggle from "@/components/navbar/ModeToggle";
// import { generateText } from "ai";
// import { google } from "@ai-sdk/google";

// export default async function Home() {
//   const { text } = await generateText({
//     model: google("models/gemini-2.0-flash-exp"),
//     prompt: "What is love?",
//   });

export default function Navbar () {
  return (
    <div className="w-full font-sans grid grid-rows-[20px_1fr_20px] items-center
    justify-items-center min-h-screen gap-16 px-20 pt-5">
      <header className="w-full">
        <nav className="w-full flex justify-end rounded-2xl p-4">
          <ModeToggle />
        </nav>
      </header>
      <main className="w-full">
        <Chatbot />
      </main>
    </div>
  );
}

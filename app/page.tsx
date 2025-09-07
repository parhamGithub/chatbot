import { Chatbox } from "@/components/chatbox/Chatbox";
import ModeToggle from "@/components/navbar/ModeToggle";

export default function Home() {
  return (
    <div
      className="w-full font-sans grid grid-rows-[20px_1fr_20px] min-h-screen"
    >
      <nav className="w-full rounded-2xl pr-4 pt-10 fixed top-0 flex justify-end">
        <ModeToggle />
      </nav>
      <main className="w-full">
        <Chatbox />
      </main>
    </div>
  );
}

import { Chatbox } from "@/components/chatbox/Chatbox";
import ModeToggle from "@/components/navbar/ModeToggle";

export default function Home() {
  return (
    <div
      className="w-full font-sans grid grid-rows-[20px_1fr_20px] items-center
    justify-items-center min-h-screen gap-16 px-20 pt-5"
    >
      <header className="w-full">
        <nav className="w-full flex justify-end rounded-2xl p-4">
          <ModeToggle />
        </nav>
      </header>
      <main className="w-full">
        <Chatbox />
      </main>
    </div>
  );
}

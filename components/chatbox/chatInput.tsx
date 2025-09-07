import { Input } from "../ui/input"

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
}

export const ChatInput = ({input, setInput}: ChatInputProps) => {
    return (
        <div
            className="relative w-full p-[2px] animate-border cursor-pointer"
        >
            <div
                className="absolute inset-0 bg-gradient-to-r
                from-red-500 via-purple-500 to-blue-500 rounded-lg"
            ></div>
            <div
                className="relative w-full h-full bg-slate-900 rounded-lg flex
                items-center justify-center"
            >
                <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="text-white focus:outline-none focus:ring-0 focus:ring-offset-0"
                />
                {/* <span className="font-bold text-white">
                Send
                </span> */}
            </div>
        </div>
    )
}
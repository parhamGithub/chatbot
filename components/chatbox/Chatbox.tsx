import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Chatbox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex justify-center items-center">
      <Card className="w-full min-h-[700px] flex flex-col">
        {/* Chat Header */}
        <CardHeader className="w-full">
          <CardTitle>Chatbot</CardTitle>
        </CardHeader>

        {/* Message Display Area */}
        <CardContent className="w-full flex-1 space-y-4">
          {/* Chat messages will go here */}
          {children}
        </CardContent>

        {/* Input and Send Area */}
        <CardFooter className="w-full flex items-center space-x-2 p-4 border-t">
          <Input placeholder="Type your message..." />
          <Button className="cursor-pointer">Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "./ChatInterface";

export function Chatbox() {
  return (
    <div className="w-full flex justify-center items-center">
      <Card className="w-full h-[700px] flex flex-col">
        <CardHeader className="w-full">
          <CardTitle>Chatbot</CardTitle>
        </CardHeader>

        <ChatInterface />
      </Card>
    </div>
  );
}

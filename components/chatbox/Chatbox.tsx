import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "./ChatInterface";

export function Chatbox() {
  return (
    <div className="w-full flex justify-center">
      <Card className="w-full flex flex-col">
        <CardHeader className="w-full">
          <CardTitle className="bolder pt-5 text-3xl text-center">Chatbot</CardTitle>
        </CardHeader>
        <ChatInterface />
      </Card>
    </div>
  );
}

"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCard } from "@/components/chatbox/MessageCard";
import { CardContent, CardFooter } from "@/components/ui/card";
import { SyncLoader } from "react-spinners";
import { GradientBorder } from "../tools/gradientBorder";

interface Message {
  content: string;
  isUser: boolean;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!input.trim()) {
      setIsLoading(false);
      return;
    };
  
    const userMessage: Message = { content: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      
      if (!response.ok) {
        setIsLoading(false);
        throw new Error("API call failed");
      }
      
      const { text } = await response.json();
      setIsLoading(false);
      const botMessage: Message = { content: text, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        content: "Error: Could not get a response from the bot.",
        isUser: false,
      };
      setIsLoading(false);
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <>
      <CardContent className="overflow-y-auto w-full flex-1 space-y-4 p-6 pt-0">
        {
          messages.length > 0 ?
          (
            messages.map((message, index) => (
              <MessageCard
                key={index}
                content={<p>{message.content}</p>}
                isUser={message.isUser}
                latestIndex={index === messages.length - 1}
              />
            ))
          ) : (
            <MessageCard
              content={<p>Hey, how can I help you?</p>}
              isUser={false}
              latestIndex={true}
            />
          )
        }
        {isLoading && (
          <MessageCard
            content={<SyncLoader size={10} color="#ffffff" speedMultiplier={.7} />}
            isUser={false}
            latestIndex={true}
          />
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="w-full flex items-center space-x-2 p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <GradientBorder classNameP="flex-9">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-white focus:outline-none focus:ring-0 focus:ring-offset-0"
            />
          </GradientBorder>
            <Button
              type="submit"
              className="w-full cursor-pointer flex-1"
            >
              Send
            </Button>
        </form>
      </CardFooter>
    </>
  );
}

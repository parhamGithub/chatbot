"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import { FaStop } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCard } from "@/components/chatbox/MessageCard";
import { CardContent, CardFooter } from "@/components/ui/card";
import { SyncLoader } from "react-spinners";
import { GradientBorder } from "../tools/gradientBorder";
import { useChat } from "@ai-sdk/react";

export function ChatInterface() {
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop } = useChat();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <>
      <CardContent className="overflow-y-auto w-full flex-1 space-y-4 p-6 pt-0">
        {messages.length > 0 ? (
          messages.map((message, index) =>
            message.parts.map((part) => {
              switch (part.type) {
                case "text":
                  return (
                    <MessageCard
                      key={message.id}
                      content={<p>{part.text}</p>}
                      isUser={message.role === "user"}
                      lastIndex={index === messages.length - 1}
                    />
                  );
              }
            })
          )
        ) : (
          <MessageCard
            content={<p>Hey, how can I help you?</p>}
            isUser={false}
            lastIndex={true}
          />
        )}
        {status === "submitted" && (
          <MessageCard
            content={
              <SyncLoader size={10} color="#ffffff" speedMultiplier={0.7} />
            }
            isUser={false}
            lastIndex={true}
          />
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="w-full flex items-center space-x-2 p-4 border-t">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="flex w-full space-x-2"
        >
          <GradientBorder classNameP="flex-9" rounded="lg">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              className="text-white focus:outline-none focus:ring-0 focus:ring-offset-0"
            />
          </GradientBorder>
          <Button
            type="submit"
            className={
              !(status === "submitted")
                ? "w-full cursor-pointer flex-1"
                : "hidden"
            }
          >
            Send
          </Button>
          <Button
            type="button"
            className={
              status === "streaming" || status === "submitted"
                ? "w-full cursor-pointer flex-1"
                : "hidden"
            }
            onClick={stop}
          >
            <FaStop />
          </Button>
        </form>
      </CardFooter>
    </>
  );
}

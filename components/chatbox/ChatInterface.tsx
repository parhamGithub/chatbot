"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import { FaStop } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCard } from "@/components/chatbox/MessageCard";
import { CardContent, CardFooter } from "@/components/ui/card";
import { SyncLoader } from "react-spinners";
import { GradientBorder } from "../tools/gradientBorder";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { FormattedMessage } from "../tools/formattedMessage";

export function ChatInterface() {
  const [input, setInput] = useState<string>("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, setMessages, regenerate } =
    useChat({
      transport: new DefaultChatTransport({
        api: "/api/chat",
      }),
    });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input, files });
    setInput("");
    setFiles(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    scrollToBottom();
  };

  const handleRegenerate = () => {
    regenerate();
  };

  const handleDelete = (id: string) => {
    const index = messages.findIndex((message) => message.id === id);
    if (index !== -1) {
      setMessages(messages.slice(0, index));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();    
  }, [messages]);

  return (
    <>
      <CardContent className="w-full flex flex-col space-y-4 p-6 pt-0">
        {messages.length > 0 ? (
          messages.map((message, index) =>
            message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  console.log("Messages updated:", messages)
                  
                  const lastIndex = index === messages.length - 1;
                  return (
                    <div
                      key={message.id}
                      className={`flex w-full flex-col gap-4 ${
                        message.role === "user" ? "items-end" : ""
                      }`}
                    >
                      <MessageCard
                        content={<FormattedMessage>{part.text}</FormattedMessage>}
                        isUser={message.role === "user"}
                        lastIndex={lastIndex}
                      />
                      <div className="mx-15 flex gap-4">
                        {
                          message.role === "user"
                          ? (
                            <FaRegTrashAlt
                              className="cursor-pointer"
                              onClick={() => handleDelete(message.id)}
                            />
                          ) : null

                        }
                        <FaRedo
                          className={`cursor-pointer ${
                            !lastIndex ? "hidden" : ""
                          }`}
                          onClick={handleRegenerate}
                        />
                      </div>
                    </div>
                  );
                case "file":
                  if (part.mediaType?.startsWith("image/")) {
                    return (
                      <Image
                        key={`${message.id}-${index}-${i}`}
                        src={part.url}
                        alt={part.filename ?? `attachment-${index}`}
                        width={200}
                        height={200}
                        className={message.role === "user" ? "self-end" : ""}
                      />
                    );
                  }
                  if (part.mediaType?.startsWith("application/pdf")) {
                    return (
                      <iframe
                        key={`${message.id}-${index}-${i}`}
                        src={part.url}
                        width={100}
                        height={150}
                        title={part.filename ?? `attachment-${index}`}
                        className={message.role === "user" ? "self-end" : ""}
                      />
                    );
                  }
                  return null;
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
          <Input
            id="picture"
            type="file"
            className="flex-1"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setFiles(e.target.files);
              }
            }}
            ref={fileInputRef}
          />
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

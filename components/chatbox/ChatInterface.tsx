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
import { useDropzone } from 'react-dropzone'
import { Chat_GetById } from "@/prisma/functions/Chat/ChatFun";
import { Message } from "@/generated/prisma";

export function ChatInterface() {
  const [input, setInput] = useState<string>("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [chatId, setChatId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect runs once when the component mounts to get or create the chat ID
    const initializeChat = async () => {
      try {
        const response = await fetch("/api/chat/db");
        
        if (!response.ok) {
          throw new Error("Failed to get or create chat");
        }
        const chat = await response.json() as Chat_GetById;
        console.log(chat);
        
        setChatId(chat?.id || "");
        setMessages(
          (chat?.Messages || []).map((msg: Message) => ({
            id: msg.id ?? "",
            role: msg.role == "user" ? "user" : "assistant",
            parts: [
              {
                type: "text",
                text: msg.content ?? "",
              },
            ],
          }))
        );
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initializeChat();
  }, []);

  const { messages, sendMessage, status, stop, setMessages, regenerate } =
    useChat({
      transport: new DefaultChatTransport({
        api: "/api/chat",
      }),
      onFinish: async ({message}) => {
        const textPart = message.parts.find(
          (part) => part.type === "text",
        );
        
        if (textPart) {
          // Send the assistant's message to the server for saving
          await fetch("/api/message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: textPart.text,
              role: "assistant",
              chatId: chatId,
            }),
          });
        }
      },
      
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || !chatId) {
      return;
    }

    // Now send the message and files to the AI
    sendMessage({ text: input, files });
    setInput("");
    setFiles(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    scrollToBottom();
  };

  const onDrop = (acceptedFiles: File[]) => {
    // Convert the acceptedFiles array to a FileList
    const dataTransfer = new DataTransfer();
    acceptedFiles.forEach(file => dataTransfer.items.add(file));
    setFiles(dataTransfer.files);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true });

  const handleRegenerate = async () => {
    // Find the last assistant message and the user message that came before it
    const lastMessage = messages[messages.length - 1];
    const userMessage = messages[messages.length - 2];

    if (!userMessage) {
        // No user message to regenerate from, do nothing
        return;
    }

    handleDelete(lastMessage.id);
    handleDelete(userMessage.id);
    regenerate();
  };

  const handleDelete = async (id: string) => {
    const index = messages.findIndex((message) => message.id === id);
    try {
      await fetch('/api/message', {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: messages[index].id }),
      });
      // Remove the message from local state
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
    } catch (error) {
      console.error("Failed to delete message:", error);
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

                        <FaRegTrashAlt
                          className="cursor-pointer"
                          onClick={() => handleDelete(message.id)}
                        />

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
              <SyncLoader size={10} className="text-primary" speedMultiplier={0.7} />
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
          <div {...getRootProps()}
            className="flex-1 cursor-pointer rounded-md border border-dashed border-input text-sm
            text-muted-foreground flex items-center px-2 justify-center"
          >
            <input id="picture"
              type="file"
              {...getInputProps()}
            />
            {files && files.length > 0 ? (
              <span>{files.length} file(s) selected</span>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
          <GradientBorder classNameP="flex-8">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              className="focus:outline-none focus:ring-0 focus:ring-offset-0"
            />
          </GradientBorder>
          <Button
            type="submit"
            className={
              !(status === "submitted")
                ? "w-full cursor-pointer flex-1 items-center justify-center m-auto"
                : "hidden"
            }
          >
            Send
          </Button>
          <Button
            type="button"
            className={
              status === "streaming" || status === "submitted"
                ? "w-full cursor-pointer flex-1 items-center justify-center m-auto"
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

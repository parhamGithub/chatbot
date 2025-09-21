"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import { FaStop, FaRegTrashAlt, FaRedo } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCard } from "@/components/chatbox/MessageCard";
import { CardContent, CardFooter } from "@/components/ui/card";
import { SyncLoader } from "react-spinners";
import { GradientBorder } from "../tools/gradientBorder";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormattedMessage } from "../tools/formattedMessage";
import { useDropzone } from "react-dropzone";
import { Chat_GetById } from "@/prisma/functions/Chat/ChatFun";
import { Message } from "@/generated/prisma";

export function ChatInterface() {
  const [input, setInput] = useState<string>("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [chatId, setChatId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, setMessages, regenerate } =
    useChat({
      transport: new DefaultChatTransport({
        api: "/api/chat",
      }),
      onFinish: async ({ message }) => {
        const textPart = message.parts.find((part) => part.type === "text");

        if (message.role === "assistant" && textPart) {
          // Send the assistant's message to the server for saving
          const res = await fetch("/api/message", {
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
          const savedMsg = await res.json();
          console.log("[onFinish] Assistant message saved to DB: ", savedMsg);

          // Compare IDs
          console.log(
            "[onFinish] Comparing frontend message ID: ",
            message.id,
            "with backend message ID: ",
            savedMsg.id
          );

          // Optionally: Replace the temporary message with the saved one
          setMessages((prev) =>
            prev.map((m) =>
              m.id === message.id
                ? {
                    ...m,
                    id: savedMsg.id,
                    parts: [{ type: "text", text: savedMsg.content }],
                  }
                : m
            )
          );
        }
        scrollToBottom();
      },
    });

  useEffect(() => {
    initializeChat();
    scrollToBottom();
  }, []);

  const initializeChat = async (): Promise<void> => {
    try {
      console.log("[initializeChat] Fetching chat from DB...");
      const response = await fetch("/api/chat/db");

      if (!response.ok) {
        console.error("[initializeChat] Failed to get or create chat");
        throw new Error("Failed to get or create chat");
      }
      const chat = (await response.json()) as Chat_GetById;
      console.log("[initializeChat] Chat fetched: ", chat);

      setChatId(chat?.id || "");
      setMessages((chat?.Messages || []).map(dbMessageToUIMessage));
      console.log("[initializeChat] Messages set: ", chat?.Messages || []);
    } catch (error) {
      console.error("Initialization error: ", error);
    }
  };

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function dbMessageToUIMessage(msg: Message):
  {id: string; role: "user" | "assistant"; parts: { type: "text"; text: string }[]} {
    return {
      id: msg.id ?? "",
      role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
      parts: [
        {
          type: "text" as const,
          text: msg.content ?? "",
        },
      ],
    };
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!input.trim() || !chatId) {
      return;
    }

    // Send the message and files to the AI
    console.log("[handleSubmit] Sending message: ", {
      text: input,
      files,
      chatId,
    });

    // Use sendMessage and handle the response to save the user message
    sendMessage({ text: input, files });

    // Save the user's message to the database immediately after sending it.
    // We don't need to `await` this, as it can happen in the background.
    fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: input,
        role: "user",
        chatId: chatId,
      }),
    })
      .then((res) => res.json())
      .then((savedMsg) => {
        console.log("[handleSubmit] User message saved to DB: ", savedMsg);
        // Replace the temporary message ID with the one from the database
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.role === "user" && !msg.id.startsWith("cmf") // A simple check for temporary ID
              ? { ...msg, id: savedMsg.id }
              : msg
          )
        );
        console.log(
          "[handleSubmit] Replaced temporary user message ID with permanent one."
        );
      })
      .catch((error) => {
        console.error("[handleSubmit] Error saving user message: ", error);
      });

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
    acceptedFiles.forEach((file) => dataTransfer.items.add(file));
    setFiles(dataTransfer.files);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleRegenerate = async () => {
    // Find the last assistant message and the user message that came before it
    const lastMessage = messages[messages.length - 1];
    console.log("[handleRegenerate] Last message: ", lastMessage);

    if (lastMessage.role === "user") {
      console.warn(
        "[handleRegenerate] Last message is from user"
      );
      regenerate();
      return;
    }

    const deletedAI = await deleteFromDb(lastMessage.id);
    if (deletedAI) {
      regenerate();
      console.log("[handleRegenerate] Regenerate called");
    }
  };

  const deleteFromDb = async (id: string) => {
    const index = messages.findIndex((message) => message.id === id);
    console.log(
      "[deleteFromDb] Deleting message at index: ",
      index,
      "with id: ",
      id
    );

    try {
      const response = await fetch("/api/message", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: messages[index].id }),
      });
      console.log("[deleteFromDb] DELETE response status: ", response.status);

      if (response.ok) {
        console.log("[deleteFromDb] Message deleted successfully: ", id);
        return true;
      }
    } catch (error) {
      console.error("Failed to delete message: ", error);
      return false;
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    console.log("[handleDelete] Attempting to delete message: ", id);
    const deleted = await deleteFromDb(id);
    if (deleted) {
      // Remove the message from local state
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== id)
      );
      console.log("[handleDelete] Message removed from local state: ", id);
    }
  };

  return (
    <>
      <CardContent className="w-full flex flex-col space-y-4 p-6 pt-0">
        {messages.length > 0 ? (
          messages.map((message, index) =>
            message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  console.log("Messages updated:", messages);

                  const lastIndex = index === messages.length - 1;
                  return (
                    <div
                      key={message.id}
                      className={`flex w-full flex-col gap-4 ${
                        message.role === "user" ? "items-end" : ""
                      }`}
                    >
                      <MessageCard
                        content={
                          <FormattedMessage>{part.text}</FormattedMessage>
                        }
                        isUser={message.role === "user"}
                        lastIndex={lastIndex}
                      />
                        {
                          lastIndex && (
                            <div className="mx-15 flex gap-4">
                              <FaRegTrashAlt
                                className="cursor-pointer"
                                onClick={() => handleDelete(message.id)}
                              />
                              <FaRedo
                                className="cursor-pointer"
                                onClick={handleRegenerate}
                              />
                            </div>
                          )
                        }
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
              <SyncLoader
                size={10}
                className="text-primary"
                speedMultiplier={0.7}
              />
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
          className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2"
        >
          <div
            {...getRootProps()}
            className="flex-1 cursor-pointer rounded-md border border-dashed border-input text-sm
            text-muted-foreground flex items-center px-2 justify-center"
          >
            <input id="picture" type="file" {...getInputProps()} />
            {files && files.length > 0 ? (
              <span>{files.length} file(s) selected</span>
            ) : (
              <p>
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
            )}
          </div>
          <GradientBorder classNameP="flex-1 md:flex-8 m-auto w-full md:w-auto flex-1">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
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

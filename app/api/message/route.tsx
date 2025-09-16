// import { GetUser } from "@/auth/AuthFunctions";
import { Chat_GetById } from "@/prisma/functions/Chat/ChatFun";
import {
  Message_CreateWithAttachment,
  Message_GetById
} from "@/prisma/functions/Message/MessageFun";
// import { cookies } from "next/headers";

export async function GET(request: Request) {
  // get id from request
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  // fetch the chat from the database
  const message = await Message_GetById(id);
  if (!message) {
    return new Response("Message not found", { status: 404 });
  }
  // check if the message is a chat message
  if (message.chatId) {
    return new Response("This is a chat message, not a standalone message.", {
      status: 400,
    });
  }
  // return the message
  return new Response(JSON.stringify(message), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { content, role, chatId, attachments } = body;
  if (!content || !role || !chatId) {
    return new Response("Content, role, and chatId are required", {
      status: 400,
    });
  }
  // const cookie = await cookies();
  // const token = cookie.get("token")?.value;
  // if (!token) {
  //   return new Response("You need to be logged in to create a message.", {
  //     status: 401,
  //   });
  // }
  // const user = await GetUser(token);
  // if (!user) {
  //   return new Response("Invalid user token.", { status: 401 });
  // }
  const chat = await Chat_GetById(chatId);
  if (!chat) {
    return new Response("Chat not found", { status: 404 });
  }
  // if (chat.userId !== user.id) {
  //   return new Response(
  //     "You are not authorized to create a message in this chat.",
  //     {
  //       status: 403,
  //     },
  //   );
  // }
  // create the message
  const newMessage = await Message_CreateWithAttachment({
    content,
    role,
    chatId,
    // userId: user.id,
    attachments: attachments,
  });
  if (!newMessage) {
    return new Response("Failed to create message", { status: 500 });
  }
  // return the message
  return new Response(JSON.stringify(newMessage), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

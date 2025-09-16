// @/app/api/message/route.tsx
// import { GetUser } from "@/auth/AuthFunctions";
import { Chat_GetById } from "@/prisma/functions/Chat/ChatFun";
import {
  Message_CreateWithAttachment,
  Message_Delete,
  Message_GetById
} from "@/prisma/functions/Message/MessageFun";
// import { cookies } from "next/headers";

export async function GET(request: Request) {
  // get id from request
  const url = new URL(request.url);

  // fetch the chat from the database
  const message = await Message_GetById("cmfmf4qq30000vfb05w8acl7f");
  
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
  
  const { content, role,  attachments } = body;
  if (!content || !role ) {
    return new Response("Content, role, and chatId are required", {
      status: 400,
    });
  }

  const chat = await Chat_GetById("cmfmf4qq30000vfb05w8acl7f");
  if (!chat) {
    return new Response("Chat not found", { status: 404 });
  }

  // create the message
  const newMessage = await Message_CreateWithAttachment({
    content,
    role,
    chatId:"cmfmf4qq30000vfb05w8acl7f",
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

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return new Response("Message ID is required", { status: 400 });
  }

  try {
    const deletedMessage = await Message_Delete(id);
    return new Response(JSON.stringify(deletedMessage), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return new Response("Message not found", { status: 404 });
    }
  }
  // Return a generic 500 for all other server errors
  console.error("Error deleting message:", error);
  return new Response("Failed to delete message", { status: 500 });
}

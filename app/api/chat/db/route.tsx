// @/app/api/chat/db/route.tsx
import { MODEL } from "@/generated/prisma";
import {
  Chat_Create,
  Chat_GetById,
  Chat_Update,
} from "@/prisma/functions/Chat/ChatFun";
import { NextRequest } from "next/server";

export async function GET() {
  const chat = await Chat_GetById("cmfmf4qq30000vfb05w8acl7f");

  if (!chat) {
    return new Response("Chat creation failed", { status: 500 });
  }

  // Return the chat object with its ID
  return new Response(JSON.stringify(chat), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, model } = body;

  const ChatTitle = title;

  const chat = await Chat_Create({
    model: model || MODEL.GPT_4_O,
    title: ChatTitle,
  });

  if (!chat) {
    return new Response("Failed to create chat", { status: 500 });
  }
  // return the chat
  return new Response(JSON.stringify(chat), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, title, model } = body;
  if (!id || !title || !model) {
    return new Response("ID, title, and model are required", { status: 400 });
  }

  // check if the model is the MODEL enum
  if (!Object.values(MODEL).includes(model)) {
    return new Response("Invalid model", { status: 400 });
  }

  const chat = await Chat_GetById(id);
  if (!chat) {
    return new Response("Chat not found", { status: 404 });
  }
  // update the chat
  const updatedChat = await Chat_Update({
    id,
    title,
    model,
  });
  if (!updatedChat) {
    return new Response("Failed to update chat", { status: 500 });
  }
  // return the updated chat
  return new Response(JSON.stringify(updatedChat), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

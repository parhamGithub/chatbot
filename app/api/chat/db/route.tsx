import {
  Chat_GetById,
} from "@/prisma/functions/Chat/ChatFun";

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

import { prisma } from "@/prisma/prisma";

export async function Chat_GetById(id: string) {
  const chat = await prisma.chat.findUnique({
    where: { id },
    include: {
      Messages: {
        include: {
          Attachments:true
        },
      },
    },
  });

  if (!chat) {
    return null; // Return null if chat is not found
  }
  return chat;
}

export type Chat_GetById = Awaited<ReturnType<typeof Chat_GetById>>;

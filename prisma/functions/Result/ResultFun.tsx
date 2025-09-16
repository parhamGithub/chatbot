import { prisma } from "@/prisma/prisma";

export async function Result_GetById(id: string) {
  const result = await prisma.result.findUnique({
    where: { id },
    include: {
      message: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("Result not found");
  }
  return result;
}

export type Result_GetById = Awaited<ReturnType<typeof Result_GetById>>;
export async function Result_GetByMessageId(messageId: string) {
  const result = await prisma.result.findMany({
    where: { messageId },
    include: {
      message: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("No results found for this message");
  }
  return result;
}

export type Result_GetByMessageId = Awaited<
  ReturnType<typeof Result_GetByMessageId>
>;

export async function Result_GetAll() {
  const results = await prisma.result.findMany({
    include: {
      message: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!results) {
    throw new Error("No results found");
  }
  return results;
}
export type Result_GetAll = Awaited<ReturnType<typeof Result_GetAll>>;

export async function Result_Create(data: {
  content: string;
  messageId: string;
}) {
  const messageExists = await prisma.message.findUnique({
    where: { id: data.messageId },
  });
  if (!messageExists) {
    throw new Error("Message not found");
  }
  const result = await prisma.result.create({
    data: {
      content: data.content,
      messageId: data.messageId,
      chatId: messageExists.chatId,
      userId: messageExists.userId,
    },
    include: {
      message: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("Failed to create result");
  }
  return result;
}
export type Result_Create = Awaited<ReturnType<typeof Result_Create>>;

import { prisma } from "@/prisma/prisma";

export async function ChatModule_GetById(id: string) {
  const res = await prisma.chat_Module.findFirst({
    where: { id },
    include: {
      chat: true,
      module: true,
    },
  });

  return res;
}

export type ChatModule_GetById = Awaited<ReturnType<typeof ChatModule_GetById>>;

// get by module id
export async function ChatModule_GetByModuleId(moduleId: string) {
  const res = await prisma.chat_Module.findMany({
    where: { moduleId },
    include: {
      chat: true,
      module: true,
    },
  });

  return res;
}
export type ChatModule_GetByModuleId = Awaited<
  ReturnType<typeof ChatModule_GetByModuleId>
>;

// get by chat id
export async function ChatModule_GetByChatId(chatId: string) {
  const res = await prisma.chat_Module.findMany({
    where: { chatId },
    include: {
      chat: true,
      module: true,
    },
  });

  return res;
}
export type ChatModule_GetByChatId = Awaited<
  ReturnType<typeof ChatModule_GetByChatId>
>;

export async function ChatModule_GetAll() {
  const res = await prisma.chat_Module.findMany({
    include: {
      chat: true,
      module: true,
    },
  });

  return res;
}
export type ChatModule_GetAll = Awaited<ReturnType<typeof ChatModule_GetAll>>;

// create chat module
export async function ChatModule_Create(data: {
  chatId: string;
  moduleId: string;
}) {
  const res = await prisma.chat_Module.create({
    data,
    include: {
      chat: true,
      module: true,
    },
  });

  return res;
}

export type ChatModule_Create = Awaited<ReturnType<typeof ChatModule_Create>>;

// delete chat module
export async function ChatModule_Delete(id: string) {
  const res = await prisma.chat_Module.delete({
    where: { id },
  });

  return res;
}
export type ChatModule_Delete = Awaited<ReturnType<typeof ChatModule_Delete>>;

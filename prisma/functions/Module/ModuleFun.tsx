import { prisma } from "@/prisma/prisma";

export async function Module_GetById(id: string) {
  const res = await prisma.module.findFirst({
    where: { id },
  });

  return res;
}

export type Module_GetById = Awaited<ReturnType<typeof Module_GetById>>;

export async function Module_GetByName(name: string) {
  const res = await prisma.module.findFirst({
    where: { name },
  });

  return res;
}
export type Module__GetByName = Awaited<ReturnType<typeof Module_GetByName>>;

export async function Module_GetAll() {
  const res = await prisma.module.findMany();

  return res;
}
export type Module_GetAll = Awaited<ReturnType<typeof Module_GetAll>>;

export async function Module_Create(data: {
  name: string;
  description?: string;
  icon?: string;
}) {
  const res = await prisma.module.create({
    data,
  });

  return res;
}

export type Module_Create = Awaited<ReturnType<typeof Module_Create>>;

// delete module
export async function Module_Delete(id: string) {
  const res = await prisma.module.delete({
    where: { id },
  });

  return res;
}
export type Module_Delete = Awaited<ReturnType<typeof Module_Delete>>;

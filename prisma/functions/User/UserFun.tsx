import { GetUser } from "@/auth/AuthFunctions";
import { prisma } from "@/prisma/prisma";

export async function User_GetById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      Chats: true,
      // Modules: true,
      Notifications: true,
      Session: true,
      Role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
export type User_GetById = Awaited<ReturnType<typeof User_GetById>>;

export async function User_GetByToken(token: string) {
  const tokenUser = GetUser(token);
  if (!tokenUser) {
    throw new Error("Invalid token");
  }
  const user = await prisma.user.findFirst({
    where: {
      id: tokenUser.id,
    },
    include: {
      Chats: true,
      // Modules: true,
      Notifications: true,
      Session: true,
      Role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
export type User_GetByToken = Awaited<ReturnType<typeof User_GetByToken>>;

export async function User_GetAll() {
  const users = await prisma.user.findMany({
    include: {
      Chats: true,
      // Modules: true,
      Notifications: true,
      Session: true,
      Role: true,
    },
  });

  if (!users) {
    throw new Error("No users found");
  }
  return users;
}
export type User_GetAll = Awaited<ReturnType<typeof User_GetAll>>;

export async function User_Update(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    roleId?: string;
    is_deactivated?: boolean;
  },
) {
  const user = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      password: data.password,
      roleId: data.roleId,
      is_deactivated: data.is_deactivated,
    },
    include: {
      Chats: true,
      // Modules: true,
      Notifications: true,
      Session: true,
      Role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
export type User_Update = Awaited<ReturnType<typeof User_Update>>;





export async function User_Delete(id: string) {
  const user = await prisma.user.delete({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
export type User_Delete = Awaited<ReturnType<typeof User_Delete>>;



export async function User_Create(
  data: {
    name: string;
    password: string;
    phone: string;
  },
) {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      password: data.password,
      phone: data.phone,
    },
    include: {
      Chats: true,
      // Modules: true,
      Notifications: true,
      Session: true,
      Role: true,
    },
  });

  if (!user) {
    throw new Error("User creation failed");
  }
  return user;
}
export type User_Create = Awaited<ReturnType<typeof User_Create>>;


export async function User_ChangePassword(
  id: string,
  newPassword: string,
) {
  const user = await prisma.user.update({
    where: { id },
    data: { password: newPassword },
    include: {
      Chats: true,
      // Modules: true,
      Notifications: true,
      Session: true,
      Role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
export type User_ChangePassword = Awaited<ReturnType<typeof User_ChangePassword>>;

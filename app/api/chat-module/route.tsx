import {
  ChatModule_GetByChatId,
  ChatModule_GetById,
  ChatModule_GetByModuleId,
  ChatModule_GetAll,
  ChatModule_Create,
  ChatModule_Delete,
} from "@/prisma/functions/Chat_Module/ChatModuleFun";

export async function GET(request: Request) {
  // if the request has id param get the module by id if not get all modules
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const moduleId = url.searchParams.get("moduleId");
  const chatId = url.searchParams.get("chatId");

  if (id) {
    const res = await ChatModule_GetById(id);
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else if (moduleId) {
    const res = await ChatModule_GetByModuleId(moduleId);
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else if (chatId) {
    const res = await ChatModule_GetByChatId(chatId);
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    const res = await ChatModule_GetAll();
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}


export async function POST(request: Request) {
  const data = await request.json();
  const { chatId, moduleId } = data;

  // validate data
  if (!chatId || !moduleId) {
    return new Response(
      JSON.stringify({ error: "Chat ID and Module ID are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Create a new chat module association
  const res = await ChatModule_Create({
    chatId: chatId,
    moduleId: moduleId,
  });

  return new Response(JSON.stringify(res), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}


export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  // validate id
  if (!id) {
    return new Response(JSON.stringify({ error: "Id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // delete chat module
  const res = await ChatModule_Delete(id);
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


import {
  Module_Create,
  Module_Delete,
  Module_GetAll,
  Module_GetById,
} from "@/prisma/functions/Module/ModuleFun";

export async function GET(request: Request) {
  // if the request has id param get the module by id if not get all modules
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const res = await Module_GetById(id);
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    const res = await Module_GetAll();
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function POST(request: Request) {
  const data = await request.json();
  const { name, description, icon } = data;

  // validate data
  if (!name) {
    return new Response(JSON.stringify({ error: "Name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await Module_Create({
    name: name,
    description: description,
    icon: icon,
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

  // delete module
  const res = await Module_Delete(id);
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


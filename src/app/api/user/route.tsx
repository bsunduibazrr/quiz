import prisma from "@/lib/prisma";

export const POST = async (request: Request) => {
  const { email, name, clerkId } = await request.json();

  try {
    const existingUser = await prisma.user.findFirst({ where: { clerkId } });
    if (existingUser)
      return new Response(JSON.stringify({ message: "user already exists" }));
    const user = await prisma.user.create({
      data: {
        email,
        name,
        clerkId,
      },
    });
    return new Response(JSON.stringify({ message: "success", data: user }));
  } catch (err) {
    console.error(err, "error");
    return new Response("failed");
  }
};

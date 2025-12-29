import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const created = await prisma.quizResult.create({
      data: {
        title: body.title,
        content: body.content ?? "",
        score: Number(body.score),
        total: Number(body.total),
        userId,
      },
    });

    return NextResponse.json(created);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Quiz result hadgalhd aldaa" },
      { status: 500 }
    );
  }
}

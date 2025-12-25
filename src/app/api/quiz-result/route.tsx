import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const created = await prisma.quizResult.create({
      data: {
        title: body.title,
        content: body.content,
        score: body.score,
        total: body.total,
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

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type Types = {
  title: string;
  content: string;
  score: number;
  total: number;
};

export async function GET() {
  const history = await prisma.quizResult.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(history);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const created = await prisma.quizResult.create({
      data: {
        title: body.title,
        content: body.content,
        score: body.score,
        total: body.total,
        userId: body.userId,
      },
    });

    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json(
      { error: "History hadgalhd aldaa" },
      { status: 500 }
    );
  }
}

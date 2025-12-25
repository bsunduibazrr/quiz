import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const history = await prisma.quizResult.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(history);
  } catch (e) {
    return NextResponse.json(
      { error: "History awahad aldaa" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content, score, total } = body;

    if (!title || typeof score !== "number" || typeof total !== "number") {
      return NextResponse.json({ error: "Buruu input data" }, { status: 400 });
    }

    const created = await prisma.quizResult.create({
      data: {
        title,
        content: content || "",
        score,
        total,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "History hadgalhd aldaa" },
      { status: 500 }
    );
  }
}

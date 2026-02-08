import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ history: [], totalScore: 0 });
    }

    const history = await prisma.quizResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const totalScore = history.reduce((sum, item) => {
      return sum + item.score;
    }, 0);

    return NextResponse.json({ history, totalScore });
  } catch (e) {
    console.error("History fetch error:", e);
    return NextResponse.json({ history: [], totalScore: 0 }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const record = await prisma.quizResult.findFirst({
      where: { id, userId },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    await prisma.quizResult.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Delete error:", e);
    return NextResponse.json(
      { error: "History ustgahad aldaa" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, score, total } = await req.json();

    if (!title || typeof score !== "number" || typeof total !== "number") {
      return NextResponse.json({ error: "Buruu input" }, { status: 400 });
    }

    const created = await prisma.quizResult.create({
      data: {
        title,
        content: content || "",
        score,
        total,
        userId,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("Create error:", e);
    return NextResponse.json(
      { error: "History hadgalhad aldaa" },
      { status: 500 },
    );
  }
}

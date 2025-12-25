import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "title, content dutuu" },
        { status: 400 }
      );
    }
    if (!client) return <div>bkumbk</div>;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: "You summarize articles clearly and concisely in Mongolian.",
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent:\n${content}`,
        },
      ],
    });

    const expandedContent = response.output_text || "";

    return NextResponse.json({
      expandedTitle: title,
      expandedContent,
    });
  } catch (err) {
    console.error("generate error", err);
    return NextResponse.json({ error: "aldaa" }, { status: 500 });
  }
}

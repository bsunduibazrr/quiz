import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  articleId: String | "";
};

type QuizAIResponse = {
  questions: QuizQuestion[];
};

export async function POST(req: Request) {
  try {
    const body: { content?: string; articleId?: string } = await req.json();

    if (!body.content || !body.articleId) {
      return NextResponse.json({ error: "content dutu" }, { status: 400 });
    }

    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY!,
    });

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Generate 5-8 multiple choice quiz questions from the article below.

Rules:
- Each question must have 4 options
- Answer must exactly match one option
- Return ONLY valid JSON
- No explanations, no markdown

JSON format:
{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "answer": ""
    }
  ]
}

Article:
${body.content}
`,
            },
          ],
        },
      ],
    });

    const text =
      response.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) {
      return NextResponse.json(
        { error: "AI hooson butsasan" },
        { status: 500 }
      );
    }

    let quizJson: QuizAIResponse;

    try {
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      quizJson = {
        questions: Array.isArray(parsed.questions)
          ? parsed.questions
          : Array.isArray(parsed.question)
          ? parsed.question
          : [],
      };
    } catch (e) {
      return NextResponse.json(
        { error: "AI json buru format" },
        { status: 500 }
      );
    }

    if (!quizJson.questions.length) {
      return NextResponse.json({ error: "questions hoosn" }, { status: 500 });
    }

    await prisma.quiz.createMany({
      data: quizJson.questions.map((q) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        articleId: q.articleId ?? "",
      })),
    });

    return NextResponse.json({ questions: quizJson.questions });
  } catch (err) {
    console.error("quiz error:", err);
    return NextResponse.json({ error: "aldaaa" }, { status: 500 });
  }
}

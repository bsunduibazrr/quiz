import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const geminiai = new GoogleGenAI({
    apiKey: process.env.GEMINI_KEY,
  });

  try {
    const { title, content, userId } = await request.json();

    if (!title || !content || !userId) {
      return new Response(
        JSON.stringify({ error: "title, content, userId dutuu" }),
        {
          status: 400,
        }
      );
    }

    const res = await geminiai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Summarize briefly in 2-3 sentences\nTitle: ${title}\nContent:\n${content}`,
            },
          ],
        },
      ],
    });

    const summary = res?.candidates?.[0]?.content?.parts?.[0].text ?? "";
    console.log(res, "res");

    const article = await prisma.article.create({
      data: { title, content, summary, userId },
    });
    console.log(article, "article");

    return new Response(
      JSON.stringify({
        expandedTitle: article.title,
        expandedContent: article.summary,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "aldaa" }), { status: 500 });
  }
}

export const GET = async () => {
  const article = await prisma.article.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  return new Response(JSON.stringify(article), { status: 200 });
};

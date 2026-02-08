import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const { title, content, userId } = await request.json();

    if (!title || !content) {
      return new Response(JSON.stringify({ error: "title, content dutuu" }), {
        status: 400,
      });
    }

    const geminiai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY,
    });

    const res = await geminiai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Summarize briefly in 6-7 sentences\nTitle: ${title}\nContent:\n${content}`,
            },
          ],
        },
      ],
    });

    const summary = res?.candidates?.[0]?.content?.parts?.[0].text ?? "";

    // Try to save to database, but don't fail if it doesn't work
    let savedTitle = title;
    let savedSummary = summary;

    if (userId) {
      try {
        const article = await prisma.article.create({
          data: { title, content, summary, userId },
        });
        savedTitle = article.title;
        savedSummary = article.summary;
      } catch (dbErr) {
        console.warn("Failed to save article to database:", dbErr);
      }
    }

    return new Response(
      JSON.stringify({
        expandedTitle: savedTitle,
        expandedContent: savedSummary,
      }),
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "AI summary generation aldaa" }),
      { status: 500 },
    );
  }
}

export const GET = async () => {
  try {
    const article = await prisma.article.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
    return new Response(JSON.stringify(article), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch article:", err);
    return new Response(JSON.stringify(null), { status: 200 });
  }
};

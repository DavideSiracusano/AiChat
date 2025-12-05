import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Troppe richieste. Attendi 1-2 minuti e riprova." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `Errore del server: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Errore nell'API route:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Mi dispiace, si è verificato un errore. Riprova.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

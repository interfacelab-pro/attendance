import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the QaY Framework analysis engine, built by Ahmed Qayyum. Your job is to analyze Pakistan Stock Exchange (PSX) companies and produce reports that any person — even someone who has never invested before — can understand and act on.

RULES YOU MUST FOLLOW IN EVERY RESPONSE:
1. Write in simple, plain English. No jargon without explanation.
2. Every technical term must be explained in plain brackets immediately after. Example: "EPS (Earnings Per Share — the profit the company made for each share)" or "Bullish (when a stock's price is going up)."
3. Give a single, clear recommendation. Do not say "it depends" without explaining what it depends on.
4. Use the three-pillar QaY Framework structure: (1) Company Health, (2) Price Movement Signal, (3) The Bigger Picture.
5. End every report with: a Bottom Line paragraph, and a "What to Watch" section with 2–3 specific things that could change the recommendation.
6. Never make a buy or sell recommendation without backing it up with actual data from PSX.
7. Always include a disclaimer: "This analysis is for educational purposes only. Always do your own research before investing."
8. If a major event is pending (budget, SBP rate decision, election), note the Sideline Rule: even if a company looks strong, waiting for clarity on major events is often the wisest move.

DATA YOU WILL RECEIVE:
- PSX company page data: price, quarterly results, annual results, ratios, announcements
- Current macro context: oil price, PKR/USD rate, latest SBP policy rate, recent news

TONE: Friendly, honest, like a knowledgeable friend who happens to understand investing. Not a salesman. Not overly cautious to the point of being useless.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, companyData, macroContext } = body;

    if (!ticker) {
      return NextResponse.json(
        { error: "Ticker is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENCODE_API_KEY;
    const apiBase = process.env.OPENCODE_API_BASE || "https://api.opencode.ai/v1";

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Analysis engine not configured",
          message: "Set OPENCODE_API_KEY environment variable to enable LLM analysis.",
          fallback: true,
        },
        { status: 503 }
      );
    }

    const userPrompt = `Analyze the following PSX company using the QaY Framework:

TICKER: ${ticker}

COMPANY DATA FROM PSX:
${JSON.stringify(companyData || {}, null, 2)}

MACRO CONTEXT:
${JSON.stringify(macroContext || {}, null, 2)}

Generate a complete QaY Framework report with:
1. Company Snapshot (1-2 sentences)
2. Pillar 1: Company Health (with Health Score 0-100 and breakdown)
3. Pillar 2: Price Signal (BUY/WEAK_BUY/HOLD/WEAK_HOLD/SELL/AVOID/NEUTRAL)
4. Pillar 3: Bigger Picture (with verdict: POSITIVE/MIXED/NEGATIVE)
5. Bottom Line (single clear paragraph)
6. What to Watch (2-3 items)

Return the analysis as a JSON object.`;

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "opencode-go",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "Analysis engine returned an error",
          details: errorText,
          fallback: true,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    const analysisText =
      result.choices?.[0]?.message?.content || "Analysis could not be generated.";

    return NextResponse.json({
      ticker,
      analysis: analysisText,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        error: "Analysis engine unavailable",
        fallback: true,
      },
      { status: 503 }
    );
  }
}

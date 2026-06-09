import { NextRequest, NextResponse } from "next/server";

const PSX_BASE = "https://dps.psx.com.pk";

interface PsxCompanyData {
  ticker: string;
  name: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  volume: number | null;
  marketCap: number | null;
  pe: number | null;
  eps: number | null;
  dividendYield: number | null;
  yearHigh: number | null;
  yearLow: number | null;
  sector: string | null;
}

export async function GET(request: NextRequest) {
  const ticker = request.nextUrl.searchParams.get("ticker")?.toUpperCase();

  if (!ticker) {
    return NextResponse.json(
      { error: "Ticker parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${PSX_BASE}/company/${ticker}`, {
      headers: {
        "User-Agent": "QaY-Framework/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch data for ${ticker}`,
          status: response.status,
          fallback: true,
        },
        { status: response.status }
      );
    }

    const html = await response.text();

    const data: PsxCompanyData = {
      ticker,
      name: extractMeta(html, "company_name") || ticker,
      price: extractNumber(html, "current_price"),
      change: extractNumber(html, "price_change"),
      changePercent: extractNumber(html, "change_percent"),
      volume: extractNumber(html, "volume"),
      marketCap: extractNumber(html, "market_cap"),
      pe: extractNumber(html, "pe_ratio"),
      eps: extractNumber(html, "eps"),
      dividendYield: extractNumber(html, "dividend_yield"),
      yearHigh: extractNumber(html, "year_high"),
      yearLow: extractNumber(html, "year_low"),
      sector: extractMeta(html, "sector"),
    };

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        error: `Could not connect to PSX data portal for ${ticker}`,
        fallback: true,
      },
      { status: 503 }
    );
  }
}

function extractNumber(html: string, field: string): number | null {
  const patterns = [
    new RegExp(`"${field}"\\s*:\\s*([\\d.]+)`),
    new RegExp(`data-${field}=["']([\\d.]+)["']`),
    new RegExp(`class="[^"]*${field}[^"]*"[^>]*>([\\d,.]+)`),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, ""));
      return isNaN(num) ? null : num;
    }
  }
  return null;
}

function extractMeta(html: string, field: string): string | null {
  const patterns = [
    new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`),
    new RegExp(`data-${field}=["']([^"']+)["']`),
    new RegExp(`<meta[^>]*name="${field}"[^>]*content="([^"]+)"`),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

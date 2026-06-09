import { CompanyData, AnalysisReport, DailyBrief, SignalType, StoryVerdict } from "./types";

export const IDEAL_PORTFOLIO_TICKERS = [
  "MARI", "ATRL", "FFC", "LUCK", "ILP",
  "SAZE", "HUBC", "UBL", "SYS", "NESTLE",
];

export const SECTOR_MAP: Record<string, string> = {
  MARI: "Oil & Gas Exploration",
  ATRL: "Refinery",
  FFC: "Fertilizer",
  LUCK: "Cement",
  ILP: "Textile / Apparel",
  SAZE: "Automobile",
  HUBC: "Power Generation",
  UBL: "Commercial Banks",
  SYS: "Technology",
  NESTLE: "Food & Consumer",
};

export const COMPANY_NAMES: Record<string, string> = {
  MARI: "Mari Energies",
  ATRL: "Attock Refinery",
  FFC: "Fauji Fertilizer",
  LUCK: "Lucky Cement",
  ILP: "Interloop",
  SAZE: "Sazgar Engineering",
  HUBC: "Hub Power Company",
  UBL: "United Bank Limited",
  SYS: "Systems Limited",
  NESTLE: "Nestle Pakistan",
};

const REAL_PRICES: Record<string, { price: number; change: number; changePct: number; pe: number; high52: number; low52: number; epsGrowth: number; netMargin: number }> = {
  MARI: { price: 653.94, change: 6.28, changePct: 0.97, pe: 11.61, high52: 795.00, low52: 544.56, epsGrowth: -15.72, netMargin: 36.78 },
  ATRL: { price: 870.49, change: 8.28, changePct: 0.96, pe: 4.70, high52: 1005.00, low52: 597.10, epsGrowth: -52.57, netMargin: 3.97 },
  FFC: { price: 555.00, change: 0.80, changePct: 0.14, pe: 10.18, high52: 685.00, low52: 369.71, epsGrowth: 13.63, netMargin: 17.01 },
  LUCK: { price: 434.30, change: 7.81, changePct: 1.83, pe: 39.20, high52: 529.50, low52: 315.00, epsGrowth: 19.46, netMargin: 26.58 },
  ILP: { price: 82.42, change: 0.93, changePct: 1.14, pe: 9.62, high52: 99.35, low52: 57.01, epsGrowth: -65.87, netMargin: 3.10 },
  SAZE: { price: 420.00, change: 0, changePct: 0, pe: 0, high52: 500, low52: 350, epsGrowth: 0, netMargin: 0 },
  HUBC: { price: 214.79, change: 2.94, changePct: 1.39, pe: 11.41, high52: 249.99, low52: 131.00, epsGrowth: -43.68, netMargin: 144.44 },
  UBL: { price: 399.65, change: 4.89, changePct: 1.24, pe: 7.08, high52: 517.00, low52: 255.05, epsGrowth: 56.07, netMargin: 10.80 },
  SYS: { price: 147.80, change: 1.14, changePct: 0.78, pe: 27.07, high52: 174.40, low52: 100.00, epsGrowth: 30.31, netMargin: 18.13 },
  NESTLE: { price: 7656.01, change: -4.03, changePct: -0.05, pe: 19.47, high52: 10524.97, low52: 6825.01, epsGrowth: 16.45, netMargin: 8.66 },
};

function getSignalForTicker(ticker: string): SignalType {
  const data = REAL_PRICES[ticker];
  if (!data) return "NEUTRAL";
  if (data.epsGrowth > 20 && data.pe < 15) return "BUY";
  if (data.epsGrowth > 10 && data.pe < 20) return "WEAK_BUY";
  if (data.epsGrowth > 0) return "HOLD";
  if (data.epsGrowth > -20) return "WEAK_HOLD";
  return "AVOID";
}

function getStoryForTicker(ticker: string): StoryVerdict {
  const data = REAL_PRICES[ticker];
  if (!data) return "MIXED";
  if (data.epsGrowth > 15 && data.netMargin > 10) return "POSITIVE";
  if (data.epsGrowth > 0) return "MIXED";
  return "NEGATIVE";
}

const summaries: Record<string, string> = {
  MARI: "EPS down 15.7% YoY but still the highest-margin E&P company on PSX at 36.8% net margin. P/E of 11.6x is reasonable. Gas production stable, new Spinwam-1 discovery coming online.",
  ATRL: "EPS dropped 52.6% YoY as refining margins compressed sharply (gross margin fell from 7.5% to 3.2%). P/E of 4.7x is cheap but the trend is worrying. Crude receipts resumed in April after a shutdown.",
  FFC: "EPS grew 13.6% YoY — the only fertilizer company posting positive growth. Net margin stable at 17%. P/E of 10.2x is fair. Interim dividend credited in May. Demand holding up before planting season.",
  LUCK: "EPS up 19.5% YoY with the highest net margin in cement at 26.6%. P/E of 39.2x is expensive — the market is pricing in strong construction demand. Stock up 27% in the past year.",
  ILP: "EPS crashed 65.9% YoY as textile margins got squeezed (gross margin fell from 27.9% to 20.3%). Stock up 39% on the year on export hopes but fundamentals are weakening. Watch cotton prices.",
  SAZE: "PSX data unavailable for this ticker. Sazgar continues to dominate the small SUV segment. Wait for clarity on auto import policy before adding.",
  HUBC: "EPS down 43.7% YoY but the company maintains massive net margins (144% — likely due to one-time gains). P/E of 11.4x is fair. Three interim dividends paid this year. Circular debt remains a risk.",
  UBL: "EPS surged 56.1% YoY — the strongest earnings growth in the Ideal Portfolio. P/E of 7.1x is attractive for a bank. Stock up 55.7% in the past year. Benefiting from high SBP rates.",
  SYS: "EPS up 30.3% YoY with 18.1% net margin. P/E not available but revenue grew 14.8% to Rs. 44.2B. Pakistan's largest IT exporter benefits from rupee weakness. Stock down 13.5% YTD despite strong results.",
  NESTLE: "EPS up 16.5% YoY — steady defensive growth. P/E of 19.5x is premium but justified for a consumer staples leader. Net margin at 8.7%. Stock down 3.7% YTD but only 8% off its 52-week high. Low free float (10%).",
};

export function getMockCompanyData(ticker: string): CompanyData {
  const real = REAL_PRICES[ticker];
  const price = real?.price || 100;
  const change = real?.change || 0;
  const changePct = real?.changePct || 0;
  const healthScore = Math.floor(Math.random() * 40) + 60;

  return {
    ticker,
    name: COMPANY_NAMES[ticker] || ticker,
    sector: SECTOR_MAP[ticker] || "Other",
    currentPrice: price,
    previousClose: price - change,
    change: change,
    changePercent: changePct,
    healthScore,
    signal: getSignalForTicker(ticker),
    storyVerdict: getStoryForTicker(ticker),
    summary: summaries[ticker] || "Analysis pending.",
    lastUpdated: new Date().toISOString(),
  };
}

export function getMockIdealPortfolio(): CompanyData[] {
  return IDEAL_PORTFOLIO_TICKERS.map(getMockCompanyData);
}

export function getMockAnalysisReport(ticker: string): AnalysisReport {
  const name = COMPANY_NAMES[ticker] || ticker;
  const sector = SECTOR_MAP[ticker] || "Other";
  const data = getMockCompanyData(ticker);
  const real = REAL_PRICES[ticker];

  return {
    ticker,
    companyName: name,
    sector,
    snapshot: `${name} (${ticker}) is one of Pakistan's leading ${sector.toLowerCase()} companies. The company is listed on the Pakistan Stock Exchange and is a key player in its sector.`,
    pillarOne: {
      overallScore: data.healthScore,
      summary: data.healthScore >= 85
        ? `${name} is performing exceptionally well. The company's profits have been growing consistently, and it is outperforming most of its competitors.`
        : data.healthScore >= 70
        ? `${name} is in solid shape. Profits are growing and the company is above average compared to others in its sector.`
        : `${name} is doing okay but nothing exceptional. The company's growth has been flat and it is roughly on par with competitors.`,
      dimensions: [
        {
          label: "This Quarter's Result",
          score: Math.floor(Math.random() * 30) + 70,
          detail: real
            ? `EPS ${real.epsGrowth > 0 ? "grew" : "changed"} ${real.epsGrowth.toFixed(1)}% year-over-year. ${real.epsGrowth > 0 ? "The company is earning more per share than this time last year." : "Earnings have declined compared to the same quarter last year."}`
            : "Quarterly data not available.",
        },
        {
          label: "Last 12 Months (TTM)",
          score: Math.floor(Math.random() * 30) + 65,
          detail: `Over the past 12 months, the company has shown ${real && real.epsGrowth > 10 ? "strong" : real && real.epsGrowth > 0 ? "modest" : "weak"} growth. Think of TTM (Trailing Twelve Months) as looking at the last 4 quarters combined — it smooths out seasonal bumps and gives a clearer picture.`,
        },
        {
          label: "Last 3 Years",
          score: Math.floor(Math.random() * 30) + 60,
          detail: `Over 3 years, the company has been ${real && real.epsGrowth > 20 ? "building significant strength" : real && real.epsGrowth > 0 ? "maintaining stability" : "facing headwinds"}. ${real && real.epsGrowth > 0 ? "Profits have grown year after year." : "Profits have been under pressure."}`,
        },
        {
          label: "Vs. Competitors",
          score: Math.floor(Math.random() * 30) + 65,
          detail: real
            ? `With a net margin of ${real.netMargin.toFixed(1)}%, ${name} ${real.netMargin > 15 ? "outperforms" : real.netMargin > 5 ? "is on par with" : "underperforms"} most peers in the ${sector} sector.`
            : `Compared to other companies in the ${sector} sector, ${name} ranks competitively.`,
        },
      ],
      ttmEps: real ? Math.round((real.price / real.pe) * 100) / 100 : 0,
      ttmEpsGrowth: real?.epsGrowth || 0,
      quarterlyRevenue: Math.round(Math.random() * 50000 + 10000),
      quarterlyProfit: Math.round(Math.random() * 10000 + 2000),
      peRatio: real?.pe || 0,
      pbRatio: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
      dividendYield: Math.round((Math.random() * 8 + 1) * 100) / 100,
    },
    pillarTwo: {
      signal: data.signal,
      currentPrice: data.currentPrice,
      yearHigh: real?.high52 || Math.round(data.currentPrice * 1.25 * 100) / 100,
      yearLow: real?.low52 || Math.round(data.currentPrice * 0.75 * 100) / 100,
      avgVolume: Math.floor(Math.random() * 5000000 + 500000),
      ma50: Math.round(data.currentPrice * (1 + (Math.random() - 0.5) * 0.1) * 100) / 100,
      ma200: Math.round(data.currentPrice * (1 + (Math.random() - 0.5) * 0.2) * 100) / 100,
      rsi: Math.round(Math.random() * 60 + 20),
      explanation: data.signal === "BUY"
        ? `The stock price of ${name} is showing strength. It is trading above its 50-day moving average (the average price over the last 50 days — a sign the trend is up). Trading volume is healthy, meaning there is genuine buying interest. The RSI (Relative Strength Index — a measure of whether a stock is overbought or oversold, from 0 to 100) is in a healthy range, suggesting there is still room for the price to go up.`
        : data.signal === "HOLD" || data.signal === "WEAK_HOLD"
        ? `The stock price of ${name} is moving steadily. It has not broken any major support or resistance levels (price points where the stock historically stops falling or rising). If you already own this, there is no reason to sell yet. If you do not own it, you can wait for a clearer signal.`
        : `The stock price of ${name} is showing weakness. It is trading below key moving averages and the trend is pointing downward. This does not mean the company is bad — it means the market is currently not rewarding this stock.`,
    },
    pillarThree: {
      verdict: data.storyVerdict,
      oilPrices: data.storyVerdict === "POSITIVE"
        ? "Oil prices are stable around $80/barrel. This is good news for companies that use oil as input — costs are predictable."
        : "Oil prices have been volatile recently. If you own companies that depend on oil imports (like refineries or airlines), this adds uncertainty.",
      budget: "The federal budget is expected in June. Watch for changes in corporate tax rates, industry-specific levies, and development spending that could benefit sectors like cement and steel.",
      interestRates: "The SBP (State Bank of Pakistan) policy rate is currently at 22%. High interest rates mean borrowing is expensive for companies, but banks earn more. If rates start cutting, it will be a big positive for most sectors.",
      pkrUsd: "The Pakistani Rupee is trading around Rs. 278 per USD. A weaker rupee helps exporters (like textiles and tech) because they earn in dollars. But it hurts importers who pay more for raw materials.",
      globalEvents: "Global markets are watching US Federal Reserve policy and Middle East tensions closely. Any escalation could push oil prices up and hurt emerging markets like Pakistan.",
      companyNews: `${name} recently announced quarterly results. ${real ? `EPS ${real.epsGrowth > 0 ? "grew" : "declined"} ${Math.abs(real.epsGrowth).toFixed(1)}% year-over-year.` : "No major updates reported."}`,
      summary: data.storyVerdict === "POSITIVE"
        ? `The bigger picture looks good for ${name}. Stable oil prices, potential interest rate cuts later this year, and a weaker rupee all work in this company's favor. The main risk is political uncertainty around the budget.`
        : data.storyVerdict === "MIXED"
        ? `The bigger picture is mixed for ${name}. Some factors (like stable oil) are helpful, but others (like high interest rates) are a headwind. Watch the budget and SBP decisions closely.`
        : `The bigger picture is challenging for ${name}. Rising oil prices, a volatile rupee, and policy uncertainty are all working against this company right now. Consider waiting for clarity before making any moves.`,
    },
    bottomLine: data.signal === "BUY" || data.signal === "WEAK_BUY"
      ? `Based on the QaY Framework analysis, ${name} (${ticker}) looks like a reasonable investment right now. The company's fundamentals are strong — it is making good profits and growing. The stock price trend supports buying. The bigger picture is also mostly favorable. If you are looking to invest in the ${sector.toLowerCase()} sector, ${name} is a solid choice. Start with a small position and add more if the next quarterly results confirm the trend.`
      : data.signal === "HOLD" || data.signal === "WEAK_HOLD"
      ? `Based on the QaY Framework analysis, ${name} (${ticker}) is a hold. The company is doing fine but the stock price is not showing a clear direction. If you already own it, keep holding — there is no reason to sell. If you do not own it, wait for a clearer BUY signal before entering. The fundamentals are decent but not exciting enough to justify buying at current prices.`
      : `Based on the QaY Framework analysis, ${name} (${ticker}) does not look like a good investment right now. Either the company's fundamentals are weakening, the stock price trend is down, or external factors are working against it. If you own it, consider selling or reducing your position. If you do not own it, stay away for now and look at other companies in the sector.`,
    whatToWatch: [
      `Next quarterly results for ${name} — will the profit growth continue or slow down?`,
      `SBP (State Bank of Pakistan) interest rate decision — a rate cut would be positive for most stocks`,
      `Federal budget announcements — watch for any changes in corporate taxes or sector-specific policies`,
    ],
    disclaimer: "This analysis is for educational purposes only. Always do your own research before investing. Past performance does not guarantee future results.",
    generatedAt: new Date().toISOString(),
  };
}

export function getMockDailyBrief(): DailyBrief {
  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return {
    date: `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`,
    summary: "KSE-100 surged 1,539 points (+0.91%) to close at 170,493 — a strong session driven by banking and power stocks. UBL led gains with EPS up 56% YoY. HUBC jumped 1.4% on dividend momentum. The SBP held rates steady at 22%, and markets are pricing in a possible cut in the next session. Oil prices are stable around $80/barrel. The upcoming federal budget is the biggest event on the horizon — expect volatility as speculation builds around corporate tax changes.",
    sectorsToWatch: [
      "Commercial Banks — UBL posted 56% EPS growth, the strongest in the portfolio. Banks benefit from high SBP rates.",
      "Power Generation — HUBC up 1.4% today with three interim dividends paid this year. Circular debt remains a risk.",
      "Technology — SYS up 0.8% despite being down 13.5% YTD. IT exports growing but stock hasn't caught up yet.",
    ],
    companiesToWatch: [
      { ticker: "UBL", reason: "EPS surged 56.1% YoY — the strongest earnings growth in the Ideal Portfolio. P/E of 7.1x is attractive." },
      { ticker: "LUCK", reason: "EPS up 19.5% with 26.6% net margin — highest in cement. But P/E of 39.2x is expensive." },
      { ticker: "SYS", reason: "EPS up 30.3% YoY but stock down 13.5% YTD. Potential value opportunity if IT exports keep growing." },
    ],
  };
}

export function getSignalColor(signal: SignalType): string {
  const colors: Record<SignalType, string> = {
    BUY: "text-green-400",
    WEAK_BUY: "text-green-300",
    HOLD: "text-blue-400",
    WEAK_HOLD: "text-blue-300",
    SELL: "text-red-400",
    AVOID: "text-gray-400",
    NEUTRAL: "text-gray-300",
  };
  return colors[signal];
}

export function getSignalBg(signal: SignalType): string {
  const colors: Record<SignalType, string> = {
    BUY: "bg-green-500/15 border-green-500/30",
    WEAK_BUY: "bg-green-500/10 border-green-500/20",
    HOLD: "bg-blue-500/15 border-blue-500/30",
    WEAK_HOLD: "bg-blue-500/10 border-blue-500/20",
    SELL: "bg-red-500/15 border-red-500/30",
    AVOID: "bg-gray-500/15 border-gray-500/30",
    NEUTRAL: "bg-gray-500/10 border-gray-500/20",
  };
  return colors[signal];
}

export function getSignalEmoji(signal: SignalType): string {
  const emojis: Record<SignalType, string> = {
    BUY: "\u{1F7E2}",
    WEAK_BUY: "\u{1F7E1}",
    HOLD: "\u{1F535}",
    WEAK_HOLD: "\u{1F7E0}",
    SELL: "\u{1F534}",
    AVOID: "\u26AB",
    NEUTRAL: "\u2B1C",
  };
  return emojis[signal];
}

export function getSignalLabel(signal: SignalType): string {
  const labels: Record<SignalType, string> = {
    BUY: "BUY",
    WEAK_BUY: "WEAK BUY",
    HOLD: "HOLD",
    WEAK_HOLD: "WEAK HOLD",
    SELL: "SELL",
    AVOID: "AVOID",
    NEUTRAL: "NEUTRAL",
  };
  return labels[signal];
}

export function getHealthScoreColor(score: number): string {
  if (score >= 85) return "text-green-400";
  if (score >= 70) return "text-blue-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

export function getHealthScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  return "Weak";
}

export function getStoryVerdictEmoji(verdict: StoryVerdict): string {
  const emojis: Record<StoryVerdict, string> = {
    POSITIVE: "\u2705",
    MIXED: "\u26A0\uFE0F",
    NEGATIVE: "\u274C",
  };
  return emojis[verdict];
}

export function getStoryVerdictLabel(verdict: StoryVerdict): string {
  const labels: Record<StoryVerdict, string> = {
    POSITIVE: "Positive Outlook",
    MIXED: "Mixed Outlook",
    NEGATIVE: "Negative Outlook",
  };
  return labels[verdict];
}

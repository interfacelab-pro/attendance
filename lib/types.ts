export interface CompanyData {
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  healthScore: number;
  signal: SignalType;
  storyVerdict: StoryVerdict;
  summary: string;
  lastUpdated: string;
}

export type SignalType =
  | "BUY"
  | "WEAK_BUY"
  | "HOLD"
  | "WEAK_HOLD"
  | "SELL"
  | "AVOID"
  | "NEUTRAL";

export type StoryVerdict = "POSITIVE" | "MIXED" | "NEGATIVE";

export interface HealthDimension {
  label: string;
  score: number;
  detail: string;
}

export interface PillarOneData {
  overallScore: number;
  summary: string;
  dimensions: HealthDimension[];
  ttmEps: number;
  ttmEpsGrowth: number;
  quarterlyRevenue: number;
  quarterlyProfit: number;
  peRatio: number;
  pbRatio: number;
  dividendYield: number;
}

export interface PillarTwoData {
  signal: SignalType;
  currentPrice: number;
  yearHigh: number;
  yearLow: number;
  avgVolume: number;
  ma50: number;
  ma200: number;
  rsi: number;
  explanation: string;
}

export interface PillarThreeData {
  verdict: StoryVerdict;
  oilPrices: string;
  budget: string;
  interestRates: string;
  pkrUsd: string;
  globalEvents: string;
  companyNews: string;
  summary: string;
}

export interface AnalysisReport {
  ticker: string;
  companyName: string;
  sector: string;
  snapshot: string;
  pillarOne: PillarOneData;
  pillarTwo: PillarTwoData;
  pillarThree: PillarThreeData;
  bottomLine: string;
  whatToWatch: string[];
  disclaimer: string;
  generatedAt: string;
}

export interface DailyBrief {
  date: string;
  summary: string;
  sectorsToWatch: string[];
  companiesToWatch: { ticker: string; reason: string }[];
}

export interface PortfolioItem {
  ticker: string;
  addedAt: string;
  lastAnalysis?: AnalysisReport;
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: "free" | "paid";
  portfolio: PortfolioItem[];
}

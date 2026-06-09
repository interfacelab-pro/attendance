"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Globe,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import {
  getMockAnalysisReport,
  getSignalColor,
  getSignalBg,
  getSignalEmoji,
  getSignalLabel,
  getHealthScoreColor,
  getHealthScoreLabel,
  getStoryVerdictEmoji,
  getStoryVerdictLabel,
} from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-navy-light">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`h-full rounded-full ${color}`}
        style={{
          background:
            score >= 85
              ? "#22c55e"
              : score >= 70
              ? "#3b82f6"
              : score >= 50
              ? "#f59e0b"
              : "#ef4444",
        }}
      />
    </div>
  );
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-card-border bg-card-bg">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-accent" />
          <span className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground">
            {title}
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-muted" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted" />
        )}
      </button>
      {open && <div className="border-t border-card-border px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

export default function AnalysisPage() {
  const params = useParams();
  const ticker = (params?.ticker as string)?.toUpperCase() || "";

  return <AnalysisContent key={ticker} ticker={ticker} />;
}

function AnalysisContent({ ticker }: { ticker: string }) {
  const [showContent, setShowContent] = useState(false);
  const report = useMemo(() => getMockAnalysisReport(ticker), [ticker]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="mt-4 text-sm text-muted">
            Analyzing {ticker} using the QaY Framework...
          </p>
        </div>
      </div>
    );
  }

  const generatedDate = new Date(report.generatedAt).toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Karachi",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <motion.div initial="hidden" animate="visible">
          <motion.div custom={0} variants={fadeUp}>
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to search
            </Link>
          </motion.div>

          <motion.div custom={1} variants={fadeUp} className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl">
                    {report.ticker}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-bold ${getSignalColor(report.pillarTwo.signal)} ${getSignalBg(report.pillarTwo.signal)}`}
                  >
                    {getSignalEmoji(report.pillarTwo.signal)} {getSignalLabel(report.pillarTwo.signal)}
                  </span>
                </div>
                <p className="mt-1 text-muted">{report.companyName} — {report.sector}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <Clock className="h-3 w-3" />
                  Generated: {generatedDate}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-bold text-foreground">
                  Rs. {report.pillarTwo.currentPrice.toLocaleString()}
                </p>
                <p className="text-sm text-muted">Current Price</p>
              </div>
            </div>

            <p className="mt-4 rounded-lg bg-navy-light p-4 text-sm leading-relaxed text-foreground/80">
              {report.snapshot}
            </p>
          </motion.div>

          <motion.div custom={2} variants={fadeUp} className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-card-border bg-card-bg p-4 text-center">
              <p className={`text-3xl font-bold ${getHealthScoreColor(report.pillarOne.overallScore)}`}>
                {report.pillarOne.overallScore}
              </p>
              <p className="mt-1 text-xs text-muted">Health Score</p>
              <p className={`text-xs font-medium ${getHealthScoreColor(report.pillarOne.overallScore)}`}>
                {getHealthScoreLabel(report.pillarOne.overallScore)}
              </p>
            </div>
            <div className="rounded-xl border border-card-border bg-card-bg p-4 text-center">
              <p className="text-3xl font-bold text-foreground">
                {report.pillarOne.peRatio}x
              </p>
              <p className="mt-1 text-xs text-muted">P/E Ratio</p>
              <p className="text-xs text-muted">Price vs. Earnings</p>
            </div>
            <div className="rounded-xl border border-card-border bg-card-bg p-4 text-center">
              <p className="text-3xl font-bold text-foreground">
                {report.pillarOne.dividendYield}%
              </p>
              <p className="mt-1 text-xs text-muted">Dividend Yield</p>
              <p className="text-xs text-muted">Annual payout</p>
            </div>
          </motion.div>

          <motion.div custom={3} variants={fadeUp} className="space-y-4">
            <CollapsibleSection
              title="Pillar 1: Company Health"
              icon={BarChart3}
              defaultOpen={true}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className={`text-4xl font-bold ${getHealthScoreColor(report.pillarOne.overallScore)}`}>
                  {report.pillarOne.overallScore}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${getHealthScoreColor(report.pillarOne.overallScore)}`}>
                    {getHealthScoreLabel(report.pillarOne.overallScore)}
                  </p>
                  <p className="text-xs text-muted">Overall Health Score (0-100)</p>
                </div>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-foreground/80">
                {report.pillarOne.summary}
              </p>

              <div className="space-y-4">
                {report.pillarOne.dimensions.map((dim) => (
                  <div key={dim.label} className="rounded-lg bg-navy-light p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{dim.label}</p>
                      <span className={`text-sm font-bold ${getHealthScoreColor(dim.score)}`}>
                        {dim.score}/100
                      </span>
                    </div>
                    <ScoreBar score={dim.score} color="" />
                    <p className="mt-2 text-xs leading-relaxed text-muted">{dim.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">Rs. {report.pillarOne.ttmEps}</p>
                  <p className="text-xs text-muted">TTM EPS</p>
                </div>
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-green-400">+{report.pillarOne.ttmEpsGrowth}%</p>
                  <p className="text-xs text-muted">EPS Growth</p>
                </div>
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{report.pillarOne.pbRatio}x</p>
                  <p className="text-xs text-muted">P/B Ratio</p>
                </div>
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    Rs. {(report.pillarOne.quarterlyProfit).toLocaleString()}M
                  </p>
                  <p className="text-xs text-muted">Quarterly Profit</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Pillar 2: Price Signal"
              icon={TrendingUp}
              defaultOpen={true}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className={`text-5xl`}>{getSignalEmoji(report.pillarTwo.signal)}</span>
                <div>
                  <p className={`text-2xl font-bold ${getSignalColor(report.pillarTwo.signal)}`}>
                    {getSignalLabel(report.pillarTwo.signal)}
                  </p>
                  <p className="text-xs text-muted">Current Technical Signal</p>
                </div>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-foreground/80">
                {report.pillarTwo.explanation}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    Rs. {report.pillarTwo.yearHigh.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted">52-Week High</p>
                </div>
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    Rs. {report.pillarTwo.yearLow.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted">52-Week Low</p>
                </div>
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{report.pillarTwo.rsi}</p>
                  <p className="text-xs text-muted">RSI (0-100)</p>
                </div>
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    Rs. {report.pillarTwo.ma50.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted">50-Day MA</p>
                </div>
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    Rs. {report.pillarTwo.ma200.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted">200-Day MA</p>
                </div>
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {(report.pillarTwo.avgVolume / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-muted">Avg. Volume</p>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Pillar 3: The Bigger Picture"
              icon={Globe}
              defaultOpen={true}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{getStoryVerdictEmoji(report.pillarThree.verdict)}</span>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {getStoryVerdictLabel(report.pillarThree.verdict)}
                  </p>
                  <p className="text-xs text-muted">External Factors Summary</p>
                </div>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-foreground/80">
                {report.pillarThree.summary}
              </p>

              <div className="space-y-3">
                {[
                  { label: "Oil Prices", content: report.pillarThree.oilPrices },
                  { label: "Government Budget", content: report.pillarThree.budget },
                  { label: "Interest Rates (SBP)", content: report.pillarThree.interestRates },
                  { label: "PKR / USD", content: report.pillarThree.pkrUsd },
                  { label: "Global Events", content: report.pillarThree.globalEvents },
                  { label: "Company News", content: report.pillarThree.companyNews },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-navy-light p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
                      {item.label}
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/80">{item.content}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground">
                Bottom Line
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {report.bottomLine}
              </p>
            </div>

            <div className="rounded-xl border border-warning/20 bg-warning/5 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                <div>
                  <h3 className="font-semibold text-foreground">What to Watch</h3>
                  <p className="mt-1 text-xs text-muted">
                    These are the things that could change the recommendation above.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {report.whatToWatch.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground/80">
                        <span className="font-bold text-warning">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-navy-light p-4 text-center">
              <p className="text-xs leading-relaxed text-muted">
                {report.disclaimer}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

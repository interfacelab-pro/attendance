"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Newspaper,
  Eye,
} from "lucide-react";
import {
  getMockIdealPortfolio,
  getMockDailyBrief,
  getSignalColor,
  getSignalBg,
  getSignalEmoji,
  getSignalLabel,
  getHealthScoreColor,
  getHealthScoreLabel,
  getStoryVerdictEmoji,
  getStoryVerdictLabel,
} from "@/lib/mock-data";
import type { CompanyData, DailyBrief } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function IdealPortfolioPage() {
  const portfolio = useMemo<CompanyData[]>(() => getMockIdealPortfolio(), []);
  const brief = useMemo<DailyBrief>(() => getMockDailyBrief(), []);
  const lastUpdated = useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Karachi",
    };
    return now.toLocaleDateString("en-PK", options);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <motion.div custom={0} variants={fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl">
                Ideal Portfolio
              </h1>
              <p className="mt-2 max-w-2xl text-muted">
                10 top companies across Pakistan&apos;s leading economic sectors.
                One from each sector. Analyzed daily using the QaY Framework.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <RefreshCw className="h-3.5 w-3.5" />
              Last updated: {lastUpdated}
            </div>
          </motion.div>
        </motion.div>

        {brief && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-10 rounded-xl border border-accent/20 bg-accent/5 p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                <Newspaper className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground">
                    Daily Brief
                  </h2>
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                    {brief.date}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                  {brief.summary}
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                      Sectors to Watch Today
                    </h3>
                    <ul className="space-y-1.5">
                      {brief.sectorsToWatch.map((sector, i) => (
                        <li key={i} className="flex gap-2 text-sm text-foreground/80">
                          <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
                          {sector}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                      Companies to Watch
                    </h3>
                    <ul className="space-y-1.5">
                      {brief.companiesToWatch.map((company) => (
                        <li key={company.ticker} className="flex gap-2 text-sm text-foreground/80">
                          <Eye className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                          <span>
                            <Link
                              href={`/analysis/${company.ticker}`}
                              className="font-semibold text-accent hover:underline"
                            >
                              {company.ticker}
                            </Link>{" "}
                            — {company.reason}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {portfolio.map((company, i) => (
            <motion.div key={company.ticker} custom={i + 1} variants={fadeUp}>
              <Link
                href={`/analysis/${company.ticker}`}
                className="group block rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground">
                      {company.ticker}
                    </p>
                    <p className="text-xs text-muted">{company.sector}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold ${getSignalColor(company.signal)} ${getSignalBg(company.signal)}`}
                  >
                    {getSignalEmoji(company.signal)} {getSignalLabel(company.signal)}
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      Rs. {company.currentPrice.toLocaleString()}
                    </p>
                    <p
                      className={`mt-0.5 text-sm font-medium ${
                        company.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {company.change >= 0 ? "+" : ""}
                      {company.change.toFixed(2)} ({company.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getHealthScoreColor(company.healthScore)}`}>
                      {company.healthScore}
                    </p>
                    <p className="text-xs text-muted">{getHealthScoreLabel(company.healthScore)}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm">
                    {getStoryVerdictEmoji(company.storyVerdict)}
                  </span>
                  <span className="text-xs text-muted">
                    {getStoryVerdictLabel(company.storyVerdict)}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                  {company.summary}
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  View full analysis <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 rounded-xl border border-card-border bg-card-bg p-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div>
              <h3 className="font-semibold text-foreground">How to use the Ideal Portfolio</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                This is a starting point — not the only way to invest. Each company represents
                one of Pakistan&apos;s leading economic sectors. If you are new to investing,
                consider starting with 2-3 companies from sectors you understand well.
                Always read the full analysis before making any decision.
                The signals and scores are updated every weekday at 8:00 AM PKT.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

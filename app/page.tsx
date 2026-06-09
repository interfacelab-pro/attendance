"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { getMockIdealPortfolio } from "@/lib/mock-data";
import { getSignalColor, getSignalEmoji, getSignalLabel, getHealthScoreColor } from "@/lib/mock-data";

const tickerData = [
  { ticker: "KSE-100", value: "170,493", change: "+1539.28", pct: "+0.91%", up: true },
  { ticker: "MARI", value: "653.94", change: "+6.28", pct: "+0.97%", up: true },
  { ticker: "LUCK", value: "434.30", change: "+7.81", pct: "+1.83%", up: true },
  { ticker: "FFC", value: "555.00", change: "+0.80", pct: "+0.14%", up: true },
  { ticker: "UBL", value: "399.65", change: "+4.89", pct: "+1.24%", up: true },
  { ticker: "SYS", value: "147.80", change: "+1.14", pct: "+0.78%", up: true },
  { ticker: "HUBC", value: "214.79", change: "+2.94", pct: "+1.39%", up: true },
  { ticker: "ATRL", value: "870.49", change: "+8.28", pct: "+0.96%", up: true },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const portfolio = getMockIdealPortfolio();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/analysis/${searchQuery.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-light/50 via-background to-background" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div custom={0} variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                <Zap className="h-3.5 w-3.5" />
                Pakistan Stock Exchange, Decoded
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Invest in PSX with{" "}
              <span className="text-accent">clarity</span>, not confusion
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-6 text-lg text-muted sm:text-xl"
            >
              The QaY Framework breaks down every stock into plain English.
              No jargon. No guesswork. Just clear, honest analysis so you know
              exactly what to buy, hold, or sell.
            </motion.p>

            <motion.form
              custom={3}
              variants={fadeUp}
              onSubmit={handleSearch}
              className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-xl border border-card-border bg-card-bg p-2 shadow-lg shadow-black/20"
            >
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 shrink-0 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any PSX stock — try MARI, LUCK, ENGRO..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted/60 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-accent-hover"
              >
                Analyze
              </button>
            </motion.form>

            <motion.div custom={4} variants={fadeUp} className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
              <span>Popular:</span>
              {["MARI", "LUCK", "FFC", "UBL", "SYS"].map((t) => (
                <Link
                  key={t}
                  href={`/analysis/${t}`}
                  className="rounded-md border border-card-border px-2 py-1 text-muted transition-colors hover:border-accent/30 hover:text-accent"
                >
                  {t}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-card-border bg-navy/50">
        <div className="overflow-hidden">
          <div className="flex animate-ticker whitespace-nowrap py-4">
            {[...tickerData, ...tickerData].map((item, i) => (
              <div
                key={`${item.ticker}-${i}`}
                className="mx-6 flex items-center gap-3"
              >
                <span className="text-sm font-semibold text-foreground">
                  {item.ticker}
                </span>
                <span className="text-sm text-muted">{item.value}</span>
                <span
                  className={`flex items-center gap-0.5 text-sm font-medium ${
                    item.up ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.up ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  {item.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl"
          >
            Three pillars. One clear answer.
          </motion.h2>
          <motion.p
            custom={1}
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-muted"
          >
            Every stock analysis in the QaY Framework looks at three things:
            Is the company healthy? Is the price right? What is the bigger picture?
          </motion.p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: BarChart3,
              title: "Company Health",
              subtitle: "Pillar 1 — Fundamentals",
              description:
                "Is this company actually making money and growing? We look at quarterly results, yearly trends, and how it compares to competitors. Every number gets a Health Score from 0 to 100.",
              color: "text-green-400",
              bg: "bg-green-500/10",
              border: "border-green-500/20",
            },
            {
              icon: TrendingUp,
              title: "Price Signal",
              subtitle: "Pillar 2 — Technical",
              description:
                "Is this the right time to buy? We analyze the stock price movement, trading volume, and key indicators to give you a clear signal: BUY, HOLD, SELL, or AVOID.",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
              border: "border-blue-500/20",
            },
            {
              icon: Shield,
              title: "Bigger Picture",
              subtitle: "Pillar 3 — Story & Outlook",
              description:
                "What is happening in Pakistan and the world that could help or hurt this company? Oil prices, budget, interest rates, rupee strength — we check it all.",
              color: "text-amber-400",
              bg: "bg-amber-500/10",
              border: "border-amber-500/20",
            },
          ].map((pillar, i) => (
            <motion.div
              key={pillar.title}
              custom={i + 2}
              variants={fadeUp}
              className={`rounded-xl border ${pillar.border} ${pillar.bg} p-6 transition-transform hover:scale-[1.02]`}
            >
              <div className={`mb-4 inline-flex rounded-lg ${pillar.bg} p-3`}>
                <pillar.icon className={`h-6 w-6 ${pillar.color}`} />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {pillar.subtitle}
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-t border-card-border bg-navy/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
                  Ideal Portfolio
                </h2>
                <p className="mt-2 text-muted">
                  10 top companies across Pakistan&apos;s leading sectors. Updated daily at 8:00 AM.
                </p>
              </div>
              <Link
                href="/ideal-portfolio"
                className="hidden items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover sm:flex"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.slice(0, 6).map((company, i) => (
                <motion.div
                  key={company.ticker}
                  custom={i}
                  variants={fadeUp}
                >
                  <Link
                    href={`/analysis/${company.ticker}`}
                    className="block rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground">
                          {company.ticker}
                        </p>
                        <p className="text-xs text-muted">{company.sector}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold ${getSignalColor(company.signal)} ${
                          company.signal === "BUY" || company.signal === "WEAK_BUY"
                            ? "border-green-500/20 bg-green-500/10"
                            : company.signal === "SELL" || company.signal === "AVOID"
                            ? "border-red-500/20 bg-red-500/10"
                            : "border-blue-500/20 bg-blue-500/10"
                        }`}
                      >
                        {getSignalEmoji(company.signal)} {getSignalLabel(company.signal)}
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          Rs. {company.currentPrice.toLocaleString()}
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            company.change >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {company.change >= 0 ? "+" : ""}
                          {company.change.toFixed(2)} ({company.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getHealthScoreColor(company.healthScore)}`}>
                          {company.healthScore}
                        </p>
                        <p className="text-xs text-muted">Health</p>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
                      {company.summary}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/ideal-portfolio"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent"
              >
                View full Ideal Portfolio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-12 md:grid-cols-2 md:items-center"
        >
          <motion.div custom={0} variants={fadeUp}>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl">
              Built for Pakistanis who are new to investing
            </h2>
            <p className="mt-4 text-muted">
              You do not need a finance degree. You do not need to read 50-page annual reports.
              The QaY Framework gives you the same analysis that professional investors use —
              written in plain English that anyone can understand.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                {
                  icon: Clock,
                  title: "Daily updates at 8:00 AM",
                  desc: "Before the market opens, your portfolio analysis is ready.",
                },
                {
                  icon: Shield,
                  title: "3-pillar framework",
                  desc: "Company health, price signal, and bigger picture — every time.",
                },
                {
                  icon: Zap,
                  title: "Plain English always",
                  desc: "Every technical term explained in brackets. No jargon without context.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div custom={1} variants={fadeUp} className="relative">
            <div className="rounded-xl border border-card-border bg-card-bg p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground">
                    MARI
                  </p>
                  <p className="text-xs text-muted">Mari Energies — Oil & Gas</p>
                </div>
                <span className="rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
                  {"\u{1F7E2}"} BUY
                </span>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">78</p>
                  <p className="text-xs text-muted">Health Score</p>
                </div>
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-foreground">Rs. 653.94</p>
                  <p className="text-xs text-muted">Price</p>
                </div>
                <div className="rounded-lg bg-navy-light p-3 text-center">
                  <p className="text-lg font-bold text-green-400">+0.97%</p>
                  <p className="text-xs text-muted">Today</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-navy-light p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Bottom Line
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                    EPS down 15.7% but still the highest-margin E&P company on PSX at 36.8% net margin.
                    P/E of 11.6x is reasonable. New Spinwam-1 discovery coming online.
                  </p>
                </div>
                <div className="rounded-lg bg-navy-light p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    What to Watch
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-foreground/80">
                    <li>- Next quarterly results — will EPS decline continue or stabilize?</li>
                    <li>- SBP interest rate decision — a cut would boost most stocks</li>
                    <li>- Federal budget — watch for corporate tax changes</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-xl bg-accent/10" />
          </motion.div>
        </motion.div>
      </section>

      <section className="border-t border-card-border bg-navy/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl">
              Ready to invest with confidence?
            </h2>
            <p className="mt-4 text-muted">
              Create a free account and start analyzing PSX stocks today.
              No credit card required. No commitment.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-navy transition-colors hover:bg-accent-hover"
              >
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ideal-portfolio"
                className="inline-flex items-center gap-2 rounded-xl border border-card-border px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/30"
              >
                Browse Ideal Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

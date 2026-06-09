"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  BarChart3,
  TrendingUp,
  Calendar,
  ArrowRight,
  Crown,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  getMockCompanyData,
  getSignalColor,
  getSignalBg,
  getSignalEmoji,
  getSignalLabel,
  getHealthScoreColor,
  getHealthScoreLabel,
} from "@/lib/mock-data";
import { IDEAL_PORTFOLIO_TICKERS, COMPANY_NAMES, SECTOR_MAP } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

interface PortfolioStock {
  id?: string;
  ticker: string;
  user_id?: string;
  created_at?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const isFreeTier = true;
  const maxStocks = isFreeTier ? 5 : Infinity;

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      await loadPortfolio(user.id);
    }
    checkAuth();
  }, [supabase.auth, router]);

  async function loadPortfolio(userId: string) {
    const { data, error } = await supabase
      .from("portfolio_stocks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPortfolio(data);
    } else {
      setPortfolio([
        { ticker: "MARI" },
        { ticker: "LUCK" },
        { ticker: "FFC" },
      ]);
    }
    setLoading(false);
  }

  const filteredTickers = IDEAL_PORTFOLIO_TICKERS.filter(
    (t) =>
      !portfolio.some((p) => p.ticker === t) &&
      (t.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (COMPANY_NAMES[t] || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addStock = async (ticker: string) => {
    if (portfolio.length >= maxStocks) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("portfolio_stocks")
      .insert({ ticker, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setPortfolio([data, ...portfolio]);
    } else {
      setPortfolio([{ ticker }, ...portfolio]);
    }
    setShowAdd(false);
    setSearchQuery("");
  };

  const removeStock = async (ticker: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("portfolio_stocks")
      .delete()
      .eq("ticker", ticker)
      .eq("user_id", user.id);

    setPortfolio(portfolio.filter((p) => p.ticker !== ticker));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="mt-4 text-sm text-muted">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.div custom={0} variants={fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
                My Dashboard
              </h1>
              <p className="mt-2 text-muted">
                Your custom portfolio and analysis updates.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isFreeTier && (
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade to Daily
                </Link>
              )}
              <button
                onClick={() => setShowAdd(true)}
                disabled={portfolio.length >= maxStocks}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add Stock
              </button>
            </div>
          </motion.div>

          {isFreeTier && (
            <motion.div custom={1} variants={fadeUp} className="mt-4 rounded-lg border border-navy-lighter bg-navy-light p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Free Plan — Weekly Analysis
                  </p>
                  <p className="text-xs text-muted">
                    Your portfolio analysis refreshes every Monday morning.
                    Upgrade for daily updates and unlimited stocks.
                    ({portfolio.length}/{maxStocks} stocks used)
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-card-border bg-card-bg p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Add a stock to your portfolio</h3>
              <button
                onClick={() => { setShowAdd(false); setSearchQuery(""); }}
                className="text-sm text-muted hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ticker or company name..."
                className="w-full rounded-lg border border-card-border bg-navy-light py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
                autoFocus
              />
            </div>
            <div className="mt-3 max-h-60 overflow-y-auto">
              {filteredTickers.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted">No matching stocks found.</p>
              ) : (
                <div className="space-y-1">
                  {filteredTickers.map((ticker) => (
                    <button
                      key={ticker}
                      onClick={() => addStock(ticker)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-navy-light"
                    >
                      <div>
                        <span className="font-semibold text-foreground">{ticker}</span>
                        <span className="ml-2 text-sm text-muted">{COMPANY_NAMES[ticker]}</span>
                      </div>
                      <span className="text-xs text-muted">{SECTOR_MAP[ticker]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {portfolio.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-card-border py-20"
          >
            <BarChart3 className="h-12 w-12 text-muted/40" />
            <p className="mt-4 text-lg font-semibold text-foreground">
              Your portfolio is empty
            </p>
            <p className="mt-1 text-sm text-muted">
              Add stocks to start getting analysis updates.
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" /> Add Your First Stock
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {portfolio.map((item, i) => {
              const data = getMockCompanyData(item.ticker);
              return (
                <motion.div key={item.ticker} custom={i} variants={fadeUp}>
                  <div className="group relative rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/30">
                    <button
                      onClick={() => removeStock(item.ticker)}
                      className="absolute right-3 top-3 rounded-lg p-1.5 text-muted opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                      title="Remove from portfolio"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <Link href={`/analysis/${item.ticker}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground">
                            {item.ticker}
                          </p>
                          <p className="text-xs text-muted">{data.sector}</p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold ${getSignalColor(data.signal)} ${getSignalBg(data.signal)}`}
                        >
                          {getSignalEmoji(data.signal)} {getSignalLabel(data.signal)}
                        </span>
                      </div>

                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            Rs. {data.currentPrice.toLocaleString()}
                          </p>
                          <p
                            className={`mt-0.5 text-sm font-medium ${
                              data.change >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {data.change >= 0 ? "+" : ""}
                            {data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getHealthScoreColor(data.healthScore)}`}>
                            {data.healthScore}
                          </p>
                          <p className="text-xs text-muted">{getHealthScoreLabel(data.healthScore)}</p>
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                        {data.summary}
                      </p>

                      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                        View full analysis <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {portfolio.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 rounded-xl border border-card-border bg-card-bg p-6"
          >
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <h3 className="font-semibold text-foreground">Weekly Report</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Your next weekly report will be generated on Monday morning.
                  It will include a summary of what changed in your portfolio over the past week,
                  which companies improved or declined, and a plain-English recommendation for each holding.
                </p>
                <p className="mt-2 text-xs text-muted/60">
                  Free plan: analysis refreshes once per week (Monday). Upgrade for daily updates.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

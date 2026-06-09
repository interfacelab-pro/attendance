"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Crown, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const plans = [
  {
    name: "Free",
    price: "Rs. 0",
    period: "forever",
    description: "For beginners who want to explore PSX at their own pace.",
    icon: Zap,
    features: [
      { text: "Access to Ideal Portfolio (read-only)", included: true },
      { text: "Single stock search (1 per day)", included: true },
      { text: "Custom portfolio (up to 5 stocks)", included: true },
      { text: "Weekly analysis refresh (Monday morning)", included: true },
      { text: "Daily analysis refresh", included: false },
      { text: "Unlimited stocks in portfolio", included: false },
      { text: "Personalized daily brief", included: false },
      { text: "Unlimited stock searches", included: false },
    ],
    cta: "Get Started Free",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "Rs. 999",
    period: "/month",
    description: "For serious investors who want daily updates and deeper insights.",
    icon: Crown,
    features: [
      { text: "Access to Ideal Portfolio (read-only)", included: true },
      { text: "Unlimited single stock searches", included: true },
      { text: "Unlimited stocks in portfolio", included: true },
      { text: "Daily analysis refresh (8:00 AM, Mon-Fri)", included: true },
      { text: "Personalized daily brief for your holdings", included: true },
      { text: "Priority access to new features", included: true },
      { text: "Email alerts on signal changes", included: true },
      { text: "Sector switching recommendations", included: true },
    ],
    cta: "Start Pro Trial",
    href: "/register",
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.h1
            custom={0}
            variants={fadeUp}
            className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl"
          >
            Simple, honest pricing
          </motion.h1>
          <motion.p
            custom={1}
            variants={fadeUp}
            className="mx-auto mt-4 max-w-xl text-muted"
          >
            Start free. Upgrade when you want daily analysis and unlimited access.
            No hidden fees. Cancel anytime.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              custom={i + 2}
              variants={fadeUp}
              className={`relative rounded-xl border p-6 ${
                plan.popular
                  ? "border-accent/40 bg-accent/5"
                  : "border-card-border bg-card-bg"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-navy">
                  Most Popular
                </span>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    plan.popular ? "bg-accent/20" : "bg-navy-light"
                  }`}
                >
                  <plan.icon className={`h-5 w-5 ${plan.popular ? "text-accent" : "text-muted"}`} />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground">
                    {plan.name}
                  </h2>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted">{plan.period}</span>
              </div>

              <p className="mt-2 text-sm text-muted">{plan.description}</p>

              <Link
                href={plan.href}
                className={`mt-6 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-accent text-navy hover:bg-accent-hover"
                    : "border border-card-border bg-navy-light text-foreground hover:border-accent/30"
                }`}
              >
                {plan.cta}
              </Link>

              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature.text} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-muted/40" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? "text-foreground/80" : "text-muted/50"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 rounded-xl border border-card-border bg-card-bg p-6"
        >
          <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground">
            Frequently Asked Questions
          </h3>
          <div className="mt-4 space-y-4">
            {[
              {
                q: "Can I use QaY Framework for free?",
                a: "Yes. The free plan gives you access to the Ideal Portfolio, 1 stock search per day, and a custom portfolio of up to 5 stocks with weekly analysis. No credit card required.",
              },
              {
                q: "What does the Pro plan give me?",
                a: "Daily analysis updates (every weekday at 8:00 AM), unlimited stocks in your portfolio, unlimited stock searches, a personalized daily brief, and email alerts when a stock in your portfolio changes signal.",
              },
              {
                q: "Where does the data come from?",
                a: "All financial data is sourced directly from the Pakistan Stock Exchange (PSX) Data Portal. Macro data (oil prices, interest rates, PKR/USD) is fetched from publicly available sources.",
              },
              {
                q: "Is this financial advice?",
                a: "No. The QaY Framework is for educational purposes only. We provide analysis and insights to help you make informed decisions, but the final investment choice is always yours. Always do your own research.",
              },
              {
                q: "Can I cancel my Pro subscription?",
                a: "Yes, you can cancel anytime from your dashboard. You will keep Pro access until the end of your billing period.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-lg bg-navy-light p-4">
                <p className="text-sm font-semibold text-foreground">{faq.q}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

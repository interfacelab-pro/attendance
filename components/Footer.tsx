import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <TrendingUp className="h-4 w-4 text-navy" />
              </div>
              <span className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground">
                QaY Framework
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Pakistan&apos;s stock market, explained simply. Built by Ahmed Qayyum to help everyday Pakistanis make smarter investment decisions.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ideal-portfolio" className="text-sm text-muted transition-colors hover:text-foreground">
                  Ideal Portfolio
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted transition-colors hover:text-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
              Account
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-muted transition-colors hover:text-foreground">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted transition-colors hover:text-foreground">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-card-border pt-6">
          <p className="text-center text-xs text-muted">
            Built by Ahmed Qayyum. Data sourced from Pakistan Stock Exchange (PSX).
            This analysis is for educational purposes only. Always do your own research before investing.
          </p>
          <p className="mt-2 text-center text-xs text-muted/60">
            &copy; {new Date().getFullYear()} QaY Framework. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

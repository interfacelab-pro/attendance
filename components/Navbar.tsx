"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, TrendingUp, User, LogOut, LayoutDashboard } from "lucide-react";
import { signOut } from "@/app/actions/auth";

interface NavbarProps {
  user: { email: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/ideal-portfolio", label: "Ideal Portfolio" },
    { href: "/pricing", label: "Pricing" },
  ];

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <TrendingUp className="h-4 w-4 text-navy" />
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground">
            QaY Framework
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-navy-light text-accent"
                  : "text-muted hover:bg-navy-light/50 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/dashboard")
                  ? "bg-navy-light text-accent"
                  : "text-muted hover:bg-navy-light/50 hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="inline h-4 w-4 mr-1" />
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-red-500/30 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-accent-hover"
              >
                <User className="h-4 w-4" />
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-navy-light hover:text-foreground md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-card-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-navy-light text-accent"
                    : "text-muted hover:bg-navy-light/50 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-navy-light text-accent"
                    : "text-muted hover:bg-navy-light/50 hover:text-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
            <div className="mt-3 flex flex-col gap-2 border-t border-card-border pt-3">
              {user ? (
                <>
                  <span className="px-3 text-sm text-muted">{user.email}</span>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="rounded-lg border border-card-border px-3 py-2 text-center text-sm font-medium text-muted transition-colors hover:text-red-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-center text-sm font-medium text-muted transition-colors hover:text-foreground"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-accent px-3 py-2 text-center text-sm font-semibold text-navy transition-colors hover:bg-accent-hover"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

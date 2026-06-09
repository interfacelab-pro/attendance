import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QaY Framework — Pakistan's Stock Market, Explained Simply",
  description:
    "Understand the Pakistan Stock Exchange and make smarter investment decisions. Built by Ahmed Qayyum. Plain English analysis for everyday Pakistanis.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased">
        <Navbar user={user ? { email: user.email ?? "" } : null} />
        {children}
        <Footer />
        <AgentationProvider />
      </body>
    </html>
  );
}

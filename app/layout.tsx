import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NW Tracker",
  description: "Personal net worth tracker",
};

/**
 * Root layout — wraps all pages with global providers and navigation.
 * ClerkProvider makes auth context available app-wide.
 * pb-16 on main prevents content from being hidden behind the bottom nav.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <ClerkProvider>
          <main className="pb-16">{children}</main>
          <BottomNav />
        </ClerkProvider>
      </body>
    </html>
  );
}

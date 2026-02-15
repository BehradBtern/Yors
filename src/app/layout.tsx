import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yors - Simple Yes/No Polling for Everyone",
  description: "Create simple polls, gather opinions, and make decisions faster. Free Yes/No polling platform with real-time results. Available in 16 languages.",
  keywords: ["polling", "voting", "Yes No", "surveys", "decision making", "opinions", "real-time polls", "free polling"],
  authors: [{ name: "Yors Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Yors - Simple Yes/No Polling for Everyone",
    description: "Create simple polls, gather opinions, and make decisions faster. Free polling platform with real-time results.",
    url: "https://yors.app",
    siteName: "Yors",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yors - Simple Yes/No Polling",
    description: "Create simple polls, gather opinions, and make decisions faster.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

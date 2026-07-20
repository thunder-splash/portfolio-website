import type { Metadata } from "next";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alexey Shuganov | Senior AI-Driven Fullstack Developer",
  description:
    "Senior Fullstack Developer — Web3, React/TypeScript, AI-driven delivery. 5+ years in production.",
  keywords: [
    "Fullstack Developer",
    "React",
    "TypeScript",
    "Next.js",
    "Web3",
    "AI",
    "Alexey Shuganov",
  ],
  authors: [{ name: "Alexey Shuganov" }],
  openGraph: {
    title: "Alexey Shuganov | Senior AI-Driven Fullstack Developer",
    description: "Web3 & AI apps, built faster. React / TypeScript / Node.js.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

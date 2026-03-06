import type { Metadata } from "next";
import { Montserrat, Syne, Anton } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Chat } from "@/components/chatbot/chat-interface";
import { Suspense } from "react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "POWER.FIT - Domine seu potencial",
  description: "Performance elevada através da tecnologia fitness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${syne.variable} ${anton.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>
            <NuqsAdapter>
              {children}
              <Chat />
              <Toaster richColors position="top-right" />
            </NuqsAdapter>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}

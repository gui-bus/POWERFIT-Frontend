import type { Metadata } from "next";
import { Montserrat, Syne, Anton } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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
  metadataBase: new URL("https://powerfit.guibus.dev/"),
  title: {
    default: "POWER.FIT - Domine seu potencial",
    template: "%s | POWER.FIT",
  },
  description: "Performance elevada através da tecnologia fitness.",
  authors: [{ name: "Guilherme Bustamante", url: "https://guibus.dev/" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://powerfit.guibus.dev/",
    siteName: "POWER.FIT",
    title: "POWER.FIT - Domine seu potencial",
    description: "Performance elevada através da tecnologia fitness.",
  },
  twitter: {
    card: "summary_large_image",
    title: "POWER.FIT - Domine seu potencial",
    description: "Performance elevada através da tecnologia fitness.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
              <Toaster richColors position="top-right" />
            </NuqsAdapter>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}

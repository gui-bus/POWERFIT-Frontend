import type { Metadata } from "next";
import { Montserrat, Syne, Anton } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { CheckCircleIcon, WarningCircleIcon, InfoIcon, WarningIcon } from "@phosphor-icons/react/ssr";

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
              <Toaster 
                position="top-right"
                expand={false}
                gap={12}
                toastOptions={{
                  unstyled: true,
                  classNames: {
                    toast: "group flex items-center gap-4 w-full p-5 rounded-[2rem] border border-border bg-card shadow-2xl backdrop-blur-xl transition-all duration-500",
                    title: "font-anton italic uppercase tracking-wider text-sm leading-none",
                    description: "text-[10px] font-bold uppercase tracking-tighter text-muted-foreground",
                    actionButton: "bg-primary text-white",
                    cancelButton: "bg-muted text-foreground",
                    success: "border-primary/30 bg-primary/5",
                    error: "border-destructive/30 bg-destructive/5",
                    info: "border-blue-500/30 bg-blue-500/5",
                    warning: "border-amber-500/30 bg-amber-500/5",
                  },
                }}
                icons={{
                  success: <CheckCircleIcon weight="duotone" className="size-6 text-primary" />,
                  error: <WarningCircleIcon weight="duotone" className="size-6 text-destructive" />,
                  info: <InfoIcon weight="duotone" className="size-6 text-blue-500" />,
                  warning: <WarningIcon weight="duotone" className="size-6 text-amber-500" />,
                }}
              />
            </NuqsAdapter>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}

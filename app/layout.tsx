import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";

// 1. Import your font from the new file
import { instrumentSerif } from "./fonts"; 

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loomingo",
  description: "Smart Instagram Automation",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Loomingo",
    description: "Smart Instagram Automation",
    images: [
      {
        url: "https://loomingo.vercel.app/icon.png",
        width: 256,
        height: 256,
      }
    ],
  },
  twitter: {
    card: "summary",
    title: "Loomingo",
    description: "Smart Instagram Automation",
    images: ["https://loomingo.vercel.app/icon.png"],
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning 
      className={cn(
        "h-full", 
        "antialiased", 
        geistSans.variable, 
        geistMono.variable, 
        "font-sans", 
        inter.variable,
        instrumentSerif.variable 
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme={false} 
        >
          {children}
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
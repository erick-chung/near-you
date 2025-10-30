import type React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/layout/Header";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "NearYou - Find Restaurants Near Any Location",
  description: "Discover great places to eat and drink near any address, even before you get there.",
  openGraph: {
    title: "NearYou - Find Restaurants Near Any Location",
    description: "Discover great places to eat and drink near any address, even before you get there.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NearYou - Find Restaurants Near Any Location",
    description: "Discover great places to eat and drink near any address, even before you get there.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body 
          className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} 
          suppressHydrationWarning={true}
        >
          <GoogleMapsProvider>
            <FavoritesProvider>
              <Header />
              {children}
            </FavoritesProvider>
          </GoogleMapsProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
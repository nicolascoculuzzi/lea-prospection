import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });

export const metadata: Metadata = {
  title: "Léa Prospection",
  description: "Prospection téléphonique automatisée avec transfert vers vos représentants.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={instrument.variable}>
      <body>{children}</body>
    </html>
  );
}

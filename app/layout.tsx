import type { Metadata } from "next";
import { Bricolage_Grotesque, Fredoka, Inter } from "next/font/google";
import "./globals.css";
import { BasketProvider } from "@/lib/basket";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const heading = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-heading" });
const logo = Fredoka({ subsets: ["latin"], weight: ["700"], variable: "--font-logo" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "blocks — building sets for every builder",
  description: "Detailed building sets: cities, castles, starships and more. Fits all major brick brands.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${heading.variable} ${logo.variable} ${body.variable}`}>
      <body>
        <BasketProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </BasketProvider>
      </body>
    </html>
  );
}

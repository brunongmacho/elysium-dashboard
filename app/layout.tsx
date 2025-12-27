import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import GuildHeader from "@/components/GuildHeader";
import BackToTop from "@/components/BackToTop";

// Fantasy RPG-style fonts for Lordnine Infinite Class theme
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elysium Dashboard - Guild Management & Boss Timers",
  description: "Real-time boss timer tracking, leaderboards, and guild management for Elysium guild members",
  keywords: "Elysium, guild, boss timers, leaderboard, dashboard",
  authors: [{ name: "Elysium Guild" }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '256x256' },
    ],
    apple: [
      { url: '/icon.png', sizes: '256x256', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cinzelDecorative.variable}`}>
      <body className="antialiased font-game">
        <Providers>
          <div className="min-h-screen animated-gradient">
            {/* Navigation */}
            <Navbar />

            {/* Guild Header Banner */}
            <GuildHeader />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="relative">
                {children}
              </div>
            </main>

            {/* Back to Top Button */}
            <BackToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}

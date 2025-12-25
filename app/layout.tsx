import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elysium Dashboard",
  description: "Boss timer and guild management dashboard for Elysium guild",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-white">
                    ⚔️ ELYSIUM Dashboard
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Boss Timers
                  </a>
                  <a href="/leaderboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Leaderboards
                  </a>
                  <a href="/auctions" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Auctions
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

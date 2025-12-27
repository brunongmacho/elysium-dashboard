"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to boss timers
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-primary font-game-decorative">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gold text-rpg-title leading-tight">
                ⚔️ ELYSIUM
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl text-silver font-game-decorative">
                Guild Management Dashboard
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-game">
              Track boss spawns, monitor attendance, and manage your guild's bidding points
              for <span className="text-primary-bright font-semibold">Lordnine Infinite Class</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <a
                href="/"
                className="group relative px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-primary/50 font-game-decorative"
              >
                <span className="relative z-10">View Boss Timers</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur"></div>
              </a>

              <a
                href="/leaderboard"
                className="px-8 py-4 bg-accent hover:bg-accent-dark text-white font-bold text-lg rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-accent/50 font-game-decorative"
              >
                View Leaderboards
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-gold text-rpg-title text-center mb-16">
            Dashboard Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Boss Timers */}
            <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-6 card-3d hover:scale-105 transition-all duration-200 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⏰</div>
              <h3 className="text-2xl font-bold text-primary mb-3 font-game-decorative">Boss Spawn Timers</h3>
              <p className="text-gray-300 font-game">
                Real-time countdown to boss spawns with automatic predictions based on kill history. Never miss a spawn again!
              </p>
            </div>

            {/* Feature 2: Attendance Tracking */}
            <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-6 card-3d hover:scale-105 transition-all duration-200 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-2xl font-bold text-accent mb-3 font-game-decorative">Attendance Leaderboard</h3>
              <p className="text-gray-300 font-game">
                Track member participation with detailed statistics, attendance rates, and point earnings across all boss kills.
              </p>
            </div>

            {/* Feature 3: Points System */}
            <div className="glass backdrop-blur-sm rounded-lg border border-success/30 p-6 card-3d hover:scale-105 transition-all duration-200 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💰</div>
              <h3 className="text-2xl font-bold text-success mb-3 font-game-decorative">Bidding Points</h3>
              <p className="text-gray-300 font-game">
                Monitor available points, track spending, and view consumption rates for fair loot distribution.
              </p>
            </div>

            {/* Feature 4: Guild Rotation */}
            <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-6 card-3d hover:scale-105 transition-all duration-200 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔄</div>
              <h3 className="text-2xl font-bold text-primary mb-3 font-game-decorative">Boss Rotation</h3>
              <p className="text-gray-300 font-game">
                Know exactly when it's your guild's turn to fight shared bosses with clear rotation indicators.
              </p>
            </div>

            {/* Feature 5: Theme Customization */}
            <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-6 card-3d hover:scale-105 transition-all duration-200 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎨</div>
              <h3 className="text-2xl font-bold text-accent mb-3 font-game-decorative">Custom Themes</h3>
              <p className="text-gray-300 font-game">
                Choose from multiple color schemes including Crimson War, Royal Gold, Epic Purple, and more!
              </p>
            </div>

            {/* Feature 6: Mobile Responsive */}
            <div className="glass backdrop-blur-sm rounded-lg border border-success/30 p-6 card-3d hover:scale-105 transition-all duration-200 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📱</div>
              <h3 className="text-2xl font-bold text-success mb-3 font-game-decorative">Mobile Friendly</h3>
              <p className="text-gray-300 font-game">
                Access your dashboard anywhere, anytime. Fully optimized for mobile devices and tablets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl text-gold text-rpg-title text-center mb-12">
              Why Choose Elysium?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 font-game-decorative">Real-time</div>
                <div className="text-gray-300 font-game">Auto-refreshing timers</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-accent mb-2 font-game-decorative">35min</div>
                <div className="text-gray-300 font-game">Grace period for kills</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-success mb-2 font-game-decorative">100%</div>
                <div className="text-gray-300 font-game">Discord integrated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-gold text-rpg-title">
            Ready to Join Elysium?
          </h2>
          <p className="text-xl text-gray-300 font-game">
            Get started by exploring our boss timers or viewing the leaderboards
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="px-10 py-5 bg-primary hover:bg-primary-dark text-white font-bold text-xl rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-primary/50 font-game-decorative"
            >
              Explore Dashboard →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

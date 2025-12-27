"use client";

export default function GuildHomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Guild Welcome */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Guild Name */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl text-gold text-rpg-title leading-tight">
              ⚔️ ELYSIUM
            </h1>
            <p className="text-xl sm:text-2xl text-silver font-game-decorative">
              Lordnine Infinite Class
            </p>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-game">
              Welcome to our guild's command center. Stay updated on boss spawns, track your attendance, and manage your bidding points.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access Navigation */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Boss Timers */}
            <a
              href="/timers"
              className="group glass backdrop-blur-sm rounded-lg border border-primary/30 p-6 hover:border-primary transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">⏰</div>
                <div>
                  <h3 className="text-xl font-bold text-primary font-game-decorative">Boss Timers</h3>
                  <p className="text-sm text-gray-400 font-game">Track spawn times</p>
                </div>
              </div>
            </a>

            {/* Leaderboards */}
            <a
              href="/leaderboard"
              className="group glass backdrop-blur-sm rounded-lg border border-accent/30 p-6 hover:border-accent transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">🏆</div>
                <div>
                  <h3 className="text-xl font-bold text-accent font-game-decorative">Leaderboards</h3>
                  <p className="text-sm text-gray-400 font-game">View rankings</p>
                </div>
              </div>
            </a>

            {/* Discord Link */}
            <a
              href="https://discord.gg/your-server"
              target="_blank"
              rel="noopener noreferrer"
              className="group glass backdrop-blur-sm rounded-lg border border-primary/30 p-6 hover:border-primary transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">💬</div>
                <div>
                  <h3 className="text-xl font-bold text-primary font-game-decorative">Discord</h3>
                  <p className="text-sm text-gray-400 font-game">Join the community</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Guild Stats Overview */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl text-gold text-rpg-title mb-6">Guild Stats</h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 font-game-decorative">Active</div>
              <div className="text-sm text-gray-400 font-game">Boss Tracking</div>
            </div>

            <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2 font-game-decorative">Live</div>
              <div className="text-sm text-gray-400 font-game">Leaderboards</div>
            </div>

            <div className="glass backdrop-blur-sm rounded-lg border border-success/30 p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-success mb-2 font-game-decorative">35min</div>
              <div className="text-sm text-gray-400 font-game">Grace Period</div>
            </div>

            <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 font-game-decorative">24/7</div>
              <div className="text-sm text-gray-400 font-game">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Guild Info */}
      <section className="py-12 bg-gray-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About the Guild */}
            <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl text-gold text-rpg-title mb-4">About Elysium</h2>
              <div className="space-y-3 text-gray-300 font-game">
                <p>
                  We are a competitive guild in Lordnine Infinite Class, focused on efficient boss hunting and fair loot distribution.
                </p>
                <p>
                  Our dashboard helps members stay coordinated with real-time boss timers, attendance tracking, and a transparent bidding points system.
                </p>
              </div>
            </div>

            {/* Guild Tools */}
            <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl text-gold text-rpg-title mb-4">Tools & Features</h2>
              <ul className="space-y-3 text-gray-300 font-game">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">▸</span>
                  <span>Real-time boss spawn countdowns with predictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">▸</span>
                  <span>Attendance & points leaderboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">▸</span>
                  <span>Boss rotation tracking for shared spawns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">▸</span>
                  <span>Discord integration for notifications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Footer */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 font-game mb-4">
            Need help? Check our Discord or contact guild officers.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/timers" className="text-primary hover:text-primary-light font-game">Boss Timers</a>
            <span className="text-gray-600">•</span>
            <a href="/leaderboard" className="text-accent hover:text-accent-light font-game">Leaderboards</a>
            <span className="text-gray-600">•</span>
            <a href="https://discord.gg/your-server" className="text-primary hover:text-primary-light font-game">Discord</a>
          </div>
        </div>
      </section>
    </div>
  );
}

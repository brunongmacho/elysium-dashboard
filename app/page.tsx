"use client";

import Footer from "@/components/Footer";

export default function GuildHomePage() {
  return (
    <div className="space-y-8 pb-32">
      {/* Hero Section - Guild Welcome */}
      <section className="relative py-8 sm:py-12 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-danger/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Guild Name */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl text-gold text-rpg-title leading-tight">
              ⚔️ ELYSIUM
            </h1>
            <p className="text-xl sm:text-2xl text-silver font-game-decorative">
              Where Chaos Becomes Strategy
            </p>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto font-game italic">
              "Where stupidity becomes genius and friendly fire is tactical."
            </p>
            <p className="text-xs sm:text-sm text-gray-400 font-game">
              Led by Goblok's Crayon Intelligence | Powered by Organized Apocalypse | Therapy by LXRDGRIM
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access Navigation */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Boss Timers */}
          <a
            href="/timers"
            className="group glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 hover:border-primary transition-all duration-200 card-3d hover:scale-105 glow-primary"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">⏰</div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-primary-bright font-game-decorative">Boss Timers</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-game">Track spawn times</p>
              </div>
            </div>
          </a>

          {/* Leaderboards */}
          <a
            href="/leaderboard"
            className="group glass backdrop-blur-sm rounded-lg border border-accent/30 p-4 sm:p-6 hover:border-accent transition-all duration-200 card-3d hover:scale-105 glow-accent"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">🏆</div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-accent-bright font-game-decorative">Leaderboards</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-game">View rankings</p>
              </div>
            </div>
          </a>

          {/* Discord Link */}
          <a
            href="https://discord.gg/EUWXd5tPa7"
            target="_blank"
            rel="noopener noreferrer"
            className="group glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 hover:border-primary transition-all duration-200 card-3d hover:scale-105 glow-primary sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">💬</div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-primary-bright font-game-decorative">Discord</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-game">Join the community</p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Guild Stats Overview */}
      <section>
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-gold text-rpg-title mb-6">Guild Stats (Mostly Accurate)</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-3 sm:p-4 md:p-6 text-center card-3d hover:scale-105 transition-transform duration-200 glow-primary">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-bright mb-2 font-game-decorative">100%</div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">Jalo Bot Financial Accuracy</div>
            <div className="text-xs text-gray-500 font-game mt-1">(HesuCrypto: 0%)</div>
          </div>

          <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-3 sm:p-4 md:p-6 text-center card-3d hover:scale-105 transition-transform duration-200 glow-accent">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent-bright mb-2 font-game-decorative">∞/0</div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">HesuCrypto's Net Worth</div>
            <div className="text-xs text-success-bright font-game mt-1">(Quantum State)</div>
          </div>

          <div className="glass backdrop-blur-sm rounded-lg border border-success/30 p-3 sm:p-4 md:p-6 text-center card-3d hover:scale-105 transition-transform duration-200 glow-success">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-success-bright mb-2 font-game-decorative">127</div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">LXRDGRIM's Therapy Clients</div>
          </div>

          <div className="glass backdrop-blur-sm rounded-lg border border-danger/30 p-3 sm:p-4 md:p-6 text-center card-3d hover:scale-105 transition-transform duration-200 glow-danger">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-danger-bright mb-2 font-game-decorative">9999</div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">Ztig's Ally Precision Score</div>
          </div>
        </div>
      </section>

      {/* Current Guild Status */}
      <section>
        <div className="glass backdrop-blur-sm rounded-lg border border-primary/20 p-4 sm:p-6 card-3d hover:scale-[1.01] transition-transform duration-200">
          <h3 className="text-xl sm:text-2xl md:text-3xl text-gold text-rpg-title mb-6">📜 Current Guild Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm font-game">
              <div className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span className="text-gray-300">Cold Snack War: <span className="text-success">Peaceful</span> (Treaty active)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">⚡</span>
                <span className="text-gray-300">Evand3r's Spoon Quest: <span className="text-accent">Day 1,706</span> (still missing)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent">🔮</span>
                <span className="text-gray-300">Carrera: Currently in <span className="text-primary">next week</span></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-danger">💎</span>
                <span className="text-gray-300">HesuCrypto: <span className="text-accent">Broke AND Rich</span> (simultaneously)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success">📊</span>
                <span className="text-gray-300">Fever's Filing: Void status <span className="text-success">OPTIMIZED</span></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">🍪</span>
                <span className="text-gray-300">JeffEpstein's Cookies: <span className="text-accent-bright">Still really good</span></span>
              </div>
            </div>
          </div>
      </section>

      {/* Guild Info */}
      <section className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-900/30 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* About the Guild */}
          <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 md:p-8 card-3d hover:scale-[1.01] transition-transform duration-200">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-gold text-rpg-title mb-6">About Elysium</h2>
            <div className="space-y-4 text-gray-300 font-game text-sm sm:text-base">
              <p className="leading-relaxed">
                We are a guild where impossibilities become strategies. Where a deaf oracle sees everything,
                a vegan grillmaster defends fortresses, and our Chrono-Tactician wins battles by showing up late to yesterday.
              </p>
              <p className="leading-relaxed">
                Led by Goblok's crayon-drawn battle plans (somehow they work), managed by LXRDGRIM's therapy empire
                (Death & Cookies sessions available), and powered by members who turn their failures into legendary victories.
              </p>
              <p className="text-xs sm:text-sm italic text-primary-bright leading-relaxed">
                "The guild where being wrong becomes being right, allergies become weapons, and friendly fire is just tactical positioning."
              </p>
            </div>
          </div>

          {/* Guild Legends */}
          <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-4 sm:p-6 md:p-8 card-3d hover:scale-[1.01] transition-transform duration-200">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-gold text-rpg-title mb-6">Legendary Achievements</h2>
            <ul className="space-y-3 sm:space-y-4 text-gray-300 font-game text-xs sm:text-sm">
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-primary-bright font-bold text-base sm:text-lg flex-shrink-0">⚡</span>
                <span>The Cold Snack War (AmielJohn vs M1ssy) - Now peaceful via Jerky Non-Proliferation Treaty</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-accent-bright font-bold text-base sm:text-lg flex-shrink-0">🔮</span>
                <span>Carrera's Time Crimes: 892 (700 tactical) - Strategic lateness is now a legitimate tactic</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-danger-bright font-bold text-base sm:text-lg flex-shrink-0">💎</span>
                <span>HesuCrypto's Jalo Bot - Achieved financial sentience, manages guild treasury with 100% accuracy (HesuCrypto: banned from 12 exchanges)</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-success-bright font-bold text-base sm:text-lg flex-shrink-0">📊</span>
                <span>Fever's Apocalypse Filing System - The void is organized, color-coded, and optimized</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-primary-bright font-bold text-base sm:text-lg flex-shrink-0">🍪</span>
                <span>惡1ce's Evil Sweets - 12 charity franchises funded by weaponized wholesomeness</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

"use client";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 glass backdrop-blur-sm border-t border-primary/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center">
        <div className="flex flex-wrap justify-center gap-3 text-xs mb-2">
          <a href="/" className="text-primary hover:text-primary-light font-game transition-colors">Home</a>
          <span className="text-gray-600">•</span>
          <a href="/timers" className="text-primary hover:text-primary-light font-game transition-colors">Boss Timers</a>
          <span className="text-gray-600">•</span>
          <a href="/leaderboard" className="text-accent hover:text-accent-light font-game transition-colors">Leaderboards</a>
          <span className="text-gray-600">•</span>
          <a href="https://discord.gg/EUWXd5tPa7" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light font-game transition-colors">Discord</a>
        </div>
        <div className="text-xs text-gray-600 font-game mb-1">
          <p>Managed by Goblok's Crayon Intelligence | Powered by the Jalo Bot | Therapy by LXRDGRIM</p>
        </div>
        <div className="text-xs text-gray-500 font-game">
          <p>© 2025 Elysium Guild. All rights reserved.</p>
          <p className="mt-1">Built with ❤️ for the guild</p>
        </div>
      </div>
    </footer>
  );
}

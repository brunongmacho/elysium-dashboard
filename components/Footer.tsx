"use client";

export default function Footer() {
  return (
    <footer className="mt-auto glass backdrop-blur-sm border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs mb-2">
          <a href="/" className="inline-flex items-center gap-1.5 text-primary hover:text-primary-light font-game transition-colors group">
            <svg
              className="w-3.5 h-3.5 text-primary group-hover:text-primary-light transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Home
          </a>
          <span className="text-gray-600">•</span>
          <a href="/timers" className="inline-flex items-center gap-1.5 text-primary hover:text-primary-light font-game transition-colors group">
            <svg
              className="w-3.5 h-3.5 text-primary group-hover:text-primary-light transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Boss Timers
          </a>
          <span className="text-gray-600">•</span>
          <a href="/leaderboard" className="inline-flex items-center gap-1.5 text-accent hover:text-accent-light font-game transition-colors group">
            <svg
              className="w-3.5 h-3.5 text-accent group-hover:text-accent-light transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path d="M12 15l-2 5-3-1 2-5-2-1 1-4 4-1 4 1 1 4-2 1 2 5-3 1-2-5z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="7" r="3" />
            </svg>
            Leaderboards
          </a>
          <span className="text-gray-600">•</span>
          <a
            href="https://discord.gg/EUWXd5tPa7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary-light font-game transition-colors group"
          >
            <svg
              className="w-4 h-4 text-primary group-hover:text-primary-light transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord
          </a>
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

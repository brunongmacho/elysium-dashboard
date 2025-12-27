"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import ThemeSelector from "./ThemeSelector";
import Tooltip from "./Tooltip";
import type { BossTimersResponse } from "@/types/api";
import { swrFetcher } from "@/lib/fetch-utils";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch boss timers to show notification badge
  const { data: bossData } = useSWR<BossTimersResponse>(
    '/api/bosses',
    swrFetcher,
    { refreshInterval: 30000 }
  );

  // Count spawned bosses
  const spawnedBossCount = bossData?.bosses?.filter(boss => boss.status === 'spawned').length || 0;

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="glass backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              ⚔️ <span className="hidden sm:inline">ELYSIUM</span> Dashboard
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink href="/" active={pathname === '/'} icon={<HomeIcon />}>
              Home
            </NavLink>
            <NavLink
              href="/timers"
              active={pathname === '/timers'}
              icon={<TimerIcon />}
              badge={spawnedBossCount > 0 ? spawnedBossCount : undefined}
            >
              Boss Timers
            </NavLink>
            <NavLink href="/leaderboard" active={pathname === '/leaderboard'} icon={<LeaderboardIcon />}>
              Leaderboards
            </NavLink>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Auth Section */}
            <div className="pl-4 border-l border-primary/20">
              {status === "loading" ? (
                <div className="text-gray-400 text-sm">Loading...</div>
              ) : session ? (
                <div className="flex items-center gap-3">
                  {/* User Info - Clickable to Profile */}
                  <a
                    href={`/profile/${session.user?.id}`}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium hover:text-primary transition-colors">
                        {session.user?.name}
                      </span>
                      {!session.isInGuild && (
                        <span className="text-danger text-xs">
                          Not in guild
                        </span>
                      )}
                      {session.roleBadge && (
                        <span className="text-success text-xs">
                          {session.roleBadge}
                        </span>
                      )}
                    </div>
                  </a>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => signOut()}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn("discord")}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Sign in with Discord
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden border-t border-primary/20 overflow-hidden relative z-50"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="px-2 pt-2 pb-3 space-y-1"
            >
              <MobileNavLink href="/" active={pathname === '/'} icon={<HomeIcon />}>
                Home
              </MobileNavLink>
              <MobileNavLink
                href="/timers"
                active={pathname === '/timers'}
                icon={<TimerIcon />}
                badge={spawnedBossCount > 0 ? spawnedBossCount : undefined}
              >
                Boss Timers
              </MobileNavLink>
              <MobileNavLink href="/leaderboard" active={pathname === '/leaderboard'} icon={<LeaderboardIcon />}>
                Leaderboards
              </MobileNavLink>

            {/* Theme Selector */}
            <div className="px-3 py-2">
              <ThemeSelector />
            </div>

            {/* Auth Section Mobile */}
            <div className="border-t border-primary/20 pt-4">
              {status === "loading" ? (
                <div className="px-3 text-gray-400 text-sm">Loading...</div>
              ) : session ? (
                <div className="space-y-3">
                  {/* User Profile Link */}
                  <a
                    href={`/profile/${session.user?.id}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user?.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-white text-base font-medium">
                        {session.user?.name}
                      </span>
                      {!session.isInGuild && (
                        <span className="text-danger text-xs">
                          Not in guild
                        </span>
                      )}
                      {session.roleBadge && (
                        <span className="text-success text-xs">
                          {session.roleBadge}
                        </span>
                      )}
                    </div>
                  </a>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn("discord");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-md text-base font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Sign in with Discord
                </button>
              )}
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Desktop NavLink Component with subtle animations
interface NavLinkProps {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  badge?: number;
  children: React.ReactNode;
}

function NavLink({ href, active, icon, badge, children }: NavLinkProps) {
  return (
    <a
      href={href}
      className={`
        relative group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium font-game
        transition-all duration-200
        ${active
          ? 'text-primary-bright bg-primary/10'
          : 'text-gray-300 hover:text-primary-light hover:bg-gray-800/50'
        }
      `}
      aria-current={active ? 'page' : undefined}
    >
      <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      <span className="relative">
        {children}
        {/* Subtle underline animation */}
        <span
          className={`
            absolute -bottom-1 left-0 h-0.5 bg-primary
            transition-all duration-300 ease-out
            ${active ? 'w-full' : 'w-0 group-hover:w-full'}
          `}
        />
      </span>
      {badge !== undefined && badge > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-danger/50"
        >
          {badge > 9 ? '9+' : badge}
        </motion.span>
      )}
    </a>
  );
}

// Mobile NavLink Component
function MobileNavLink({ href, active, icon, badge, children }: NavLinkProps) {
  return (
    <a
      href={href}
      className={`
        relative flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium font-game
        transition-all duration-200
        ${active
          ? 'text-primary-bright bg-primary/10 border-l-4 border-primary'
          : 'text-gray-300 hover:text-white hover:bg-gray-700/50 border-l-4 border-transparent'
        }
      `}
      aria-current={active ? 'page' : undefined}
    >
      <span className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
        {icon}
      </span>
      <span className="flex-1">{children}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-danger text-white text-xs rounded-full px-2 py-0.5 font-bold shadow-lg shadow-danger/50">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </a>
  );
}

// Icon Components
function HomeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LeaderboardIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

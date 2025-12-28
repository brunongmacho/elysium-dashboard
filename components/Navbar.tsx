"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import dynamic from "next/dynamic";
import ThemeSelector from "./ThemeSelector";
import Tooltip from "./Tooltip";
import { Icon } from "@/components/icons";
import type { BossTimersResponse } from "@/types/api";
import { swrFetcher } from "@/lib/fetch-utils";

// Dynamically import LoginModal to prevent SSR hydration issues
const LoginModal = dynamic(() => import("./LoginModal").then(mod => ({ default: mod.LoginModal })), {
  ssr: false,
});

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 relative">
          {/* Mobile Logo - Only on mobile */}
          <div className="flex items-center flex-shrink-0 md:hidden absolute left-0">
            <h1 className="text-xl font-bold text-white">
              Dashboard
            </h1>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" active={pathname === '/'} icon={<Icon name="home" size="sm" />}>
              Home
            </NavLink>
            <NavLink
              href="/timers"
              active={pathname === '/timers'}
              icon={<Icon name="clock" size="sm" />}
              badge={spawnedBossCount > 0 ? spawnedBossCount : undefined}
            >
              Boss Timers
            </NavLink>
            <NavLink href="/rotations" active={pathname === '/rotations'} icon={<span className="text-sm">🔄</span>}>
              Rotations
            </NavLink>
            <NavLink href="/events" active={pathname === '/events'} icon={<Icon name="calendar" size="sm" />}>
              Events
            </NavLink>
            <NavLink href="/leaderboard" active={pathname === '/leaderboard'} icon={<Icon name="trophy" size="sm" />}>
              Leaderboards
            </NavLink>
          </div>

          {/* Right Side - Theme & Auth */}
          <div className="hidden md:flex items-center gap-4 absolute right-0">
            {/* Theme Selector */}
            <ThemeSelector />

            {/* Auth Section */}
            <div className="flex items-center">
              {status === "loading" ? (
                <div className="text-gray-400 text-sm whitespace-nowrap">Loading...</div>
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
                      <span className="text-white text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                        {session.user?.name}
                      </span>
                      {!session.isInGuild && (
                        <span className="text-danger text-xs whitespace-nowrap">
                          Not in guild
                        </span>
                      )}
                      {session.roleBadge && (
                        <span className="text-success text-xs whitespace-nowrap">
                          {session.roleBadge}
                        </span>
                      )}
                    </div>
                  </a>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => signOut()}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 transition-colors whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="group flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign in
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors will-change-transform"
            aria-label="Toggle mobile menu"
          >
            <div className="transform-gpu">
              {isMobileMenuOpen ? (
                <Icon name="close" size="lg" />
              ) : (
                <Icon name="menu" size="lg" />
              )}
            </div>
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
              <MobileNavLink href="/" active={pathname === '/'} icon={<Icon name="home" size="sm" />}>
                Home
              </MobileNavLink>
              <MobileNavLink
                href="/timers"
                active={pathname === '/timers'}
                icon={<Icon name="clock" size="sm" />}
                badge={spawnedBossCount > 0 ? spawnedBossCount : undefined}
              >
                Boss Timers
              </MobileNavLink>
              <MobileNavLink href="/rotations" active={pathname === '/rotations'} icon={<span className="text-sm">🔄</span>}>
                Rotations
              </MobileNavLink>
              <MobileNavLink href="/events" active={pathname === '/events'} icon={<Icon name="calendar" size="sm" />}>
                Events
              </MobileNavLink>
              <MobileNavLink href="/leaderboard" active={pathname === '/leaderboard'} icon={<Icon name="trophy" size="sm" />}>
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
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="group w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-md text-base font-medium transition-colors"
                >
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign in
                </button>
              )}
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
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


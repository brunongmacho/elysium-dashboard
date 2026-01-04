"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import dynamic from "next/dynamic";
import ThemeSelector from "./ThemeSelector";
import NotificationButton from "./NotificationButton";
import Tooltip from "./Tooltip";
import { Icon } from "@/components/icons";
import { useTimer } from "@/contexts/TimerContext";
import { useVisualEffects } from "@/contexts/VisualEffectsContext";
import type { BossTimersResponse } from "@/types/api";
import { swrFetcher } from "@/lib/fetch-utils";
import { ALL_EVENTS } from "@/data/eventSchedules";
import { calculateNextOccurrence } from "@/lib/event-utils";

// Dynamically import LoginModal to prevent SSR hydration issues
const LoginModal = dynamic(() => import("./LoginModal").then(mod => ({ default: mod.LoginModal })), {
  ssr: false,
});

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { currentTime } = useTimer();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Fetch boss timers to show notification badge
  const { data: bossData } = useSWR<BossTimersResponse>(
    '/api/bosses',
    swrFetcher,
    { refreshInterval: 30000 }
  );

  // Count spawned bosses
  const spawnedBossCount = bossData?.bosses?.filter(boss => boss.status === 'spawned').length || 0;

  // Count active events
  const activeEventCount = useMemo(() => {
    const now = currentTime;
    let activeCount = 0;

    ALL_EVENTS.forEach((event) => {
      const nextOcc = calculateNextOccurrence(event, now);
      const timeUntil = nextOcc.getTime() - now;
      const eventEndTime = nextOcc.getTime() + (event.durationMinutes * 60 * 1000);

      // Check if currently active
      if (timeUntil < 0 && now < eventEndTime) {
        activeCount++;
      }
    });

    return activeCount;
  }, [currentTime]);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[aria-label="Toggle mobile menu"]')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      // Use capture phase to ensure we catch the event before other handlers
      document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('touchstart', handleClickOutside, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
        document.removeEventListener('touchstart', handleClickOutside, true);
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <nav className="glass backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Logo - Only on mobile */}
          <div className="flex items-center flex-shrink-0 md:hidden">
            <h1 className="text-xl font-bold text-white">
              Dashboard
            </h1>
          </div>

          {/* Desktop Navigation - Centered with proper spacing */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center max-w-3xl mx-auto">
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
            <NavLink
              href="/events"
              active={pathname === '/events'}
              icon={<Icon name="calendar" size="sm" />}
              badge={activeEventCount > 0 ? activeEventCount : undefined}
            >
              Events
            </NavLink>
            <NavLink href="/leaderboard" active={pathname === '/leaderboard'} icon={<Icon name="trophy" size="sm" />}>
              Leaderboards
            </NavLink>
          </div>

          {/* Right Side - Theme & Auth */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {/* Notification Button */}
            <NotificationButton />

            {/* Animations Toggle */}
            <AnimationsToggle />

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Auth Section */}
            <div className="flex items-center">
              {status === "loading" ? (
                <div className="text-gray-400 text-sm whitespace-nowrap">Loading...</div>
              ) : session ? (
                <div className="flex items-center gap-2">
                  {/* User Info - Clickable to Profile */}
                  <a
                    href={`/profile/${session.user?.id}`}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0"
                  >
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full flex-shrink-0"
                      />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-sm font-medium hover:text-primary transition-colors truncate max-w-[120px] lg:max-w-none">
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
                    className="text-gray-300 hover:text-white px-2 lg:px-3 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="group flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
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
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors flex-shrink-0"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <Icon name="close" size="lg" />
            ) : (
              <Icon name="menu" size="lg" />
            )}
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
            ref={mobileMenuRef}
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
              className="px-2 pt-2 pb-3 space-y-1 glass backdrop-blur-sm"
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
              <MobileNavLink
                href="/events"
                active={pathname === '/events'}
                icon={<Icon name="calendar" size="sm" />}
                badge={activeEventCount > 0 ? activeEventCount : undefined}
              >
                Events
              </MobileNavLink>
              <MobileNavLink href="/leaderboard" active={pathname === '/leaderboard'} icon={<Icon name="trophy" size="sm" />}>
                Leaderboards
              </MobileNavLink>

            {/* Notification, Animations Toggle & Theme */}
            <div className="px-3 py-2 flex items-center gap-3">
              <NotificationButton />
              <AnimationsToggle />
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

// Animations Toggle Component
function AnimationsToggle() {
  const { animationsEnabled, setAnimationsEnabled, isLoaded } = useVisualEffects();

  return (
    <Tooltip content={animationsEnabled ? "Disable animations" : "Enable animations"} position="bottom">
      <button
        onClick={() => setAnimationsEnabled(!animationsEnabled)}
        disabled={!isLoaded}
        className={`
          relative p-2 rounded-md flex-shrink-0
          ${!isLoaded ? "opacity-50 cursor-wait" : ""}
          ${animationsEnabled
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
          }
        `}
        aria-label={animationsEnabled ? "Disable animations" : "Enable animations"}
        aria-pressed={animationsEnabled}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {animationsEnabled ? (
            // Play icon (animations enabled)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ) : (
            // Pause icon (animations disabled)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          )}
        </svg>
      </button>
    </Tooltip>
  );
}


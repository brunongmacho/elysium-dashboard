"use client";

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AUTH } from '@/lib/constants';

/**
 * SessionTimeoutManager
 *
 * Manages automatic session timeout for users who didn't enable "remember me".
 * - If "remember me" is enabled: Session lasts 7 days (server-side maxAge)
 * - If "remember me" is NOT enabled: Session expires after 30 minutes
 */
export function SessionTimeoutManager() {
  const { data: session, status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loginTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Only manage timeout for authenticated users
    if (status !== 'authenticated' || !session) {
      return;
    }

    // Get remember me preference
    const rememberMe = localStorage.getItem('discord_remember_me') === 'true';

    // If remember me is enabled, use the full 7-day session (managed by server)
    if (rememberMe) {
      return;
    }

    // For non-remember-me sessions, track login time and auto-logout after 30 minutes
    const currentLoginTime = loginTimeRef.current;
    const now = Date.now();

    // Set login time if not already set
    if (!currentLoginTime) {
      loginTimeRef.current = now;
      localStorage.setItem('session_login_time', now.toString());
    } else {
      // Check if session has expired (30 minutes)
      const sessionAge = now - currentLoginTime;
      const maxAge = AUTH.SESSION_MAX_AGE;

      if (sessionAge >= maxAge) {
        // Session expired, sign out
        console.log('[SessionTimeout] Session expired (30 minutes). Signing out...');
        localStorage.removeItem('session_login_time');
        signOut({ callbackUrl: '/' });
        return;
      }
    }

    // Set up a timeout to check and sign out after 30 minutes
    const timeRemaining = AUTH.SESSION_MAX_AGE - (now - (loginTimeRef.current || now));

    if (timeRemaining > 0) {
      timeoutRef.current = setTimeout(() => {
        console.log('[SessionTimeout] Session timeout reached. Signing out...');
        localStorage.removeItem('session_login_time');
        signOut({ callbackUrl: '/' });
      }, timeRemaining);
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [session, status]);

  // Load login time from localStorage on mount
  useEffect(() => {
    const savedLoginTime = localStorage.getItem('session_login_time');
    if (savedLoginTime) {
      loginTimeRef.current = parseInt(savedLoginTime, 10);
    }
  }, []);

  // Clear login time when user signs out
  useEffect(() => {
    if (status === 'unauthenticated') {
      loginTimeRef.current = null;
      localStorage.removeItem('session_login_time');
    }
  }, [status]);

  return null; // This component doesn't render anything
}

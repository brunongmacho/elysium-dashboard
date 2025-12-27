"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Button } from './ui/Button';
import { Icon } from './icons';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved preference
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('discord_remember_me');
      setRememberMe(saved === 'true');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isLoading) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isLoading, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSignIn = async () => {
    setIsLoading(true);

    // Save remember me preference
    localStorage.setItem('discord_remember_me', rememberMe.toString());

    // Clear any existing session login time (will be reset by SessionTimeoutManager)
    localStorage.removeItem('session_login_time');

    // Sign in with Discord
    await signIn('discord', {
      callbackUrl: window.location.href,
    });

    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={!isLoading ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="
                glass-strong backdrop-blur-md rounded-lg border-2 border-primary/30
                shadow-elevated-3 max-w-md w-full p-6
              "
              role="dialog"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              aria-modal="true"
            >
              {/* Discord Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="discord" size="xl" className="text-primary" />
                </div>
              </div>

              {/* Title */}
              <h2
                id="modal-title"
                className="text-2xl font-bold text-white mb-2 text-center font-game-decorative"
              >
                Sign in to ELYSIUM
              </h2>

              {/* Description */}
              <p
                id="modal-description"
                className="text-sm text-gray-300 mb-6 text-center font-game"
              >
                Connect with your Discord account to access guild features and boss timers
              </p>

              {/* Remember Me Checkbox */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                      disabled={isLoading}
                    />
                    <div className="
                      w-5 h-5 border-2 border-gray-600 rounded
                      peer-checked:bg-primary peer-checked:border-primary
                      transition-all duration-200
                      group-hover:border-primary/50
                      flex items-center justify-center
                    ">
                      {rememberMe && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-300 text-sm font-game group-hover:text-white transition-colors">
                    Remember me (stay signed in for 7 days)
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  onClick={handleSignIn}
                  loading={isLoading}
                  disabled={isLoading}
                  fullWidth
                  icon={!isLoading ? <Icon name="discord" size="md" /> : undefined}
                  className="tap-target"
                >
                  Sign in with Discord
                </Button>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isLoading}
                  fullWidth
                  className="tap-target"
                >
                  Cancel
                </Button>
              </div>

              {/* Privacy Note */}
              <p className="text-xs text-gray-500 mt-4 text-center font-game">
                We only access your Discord profile, guild membership, and roles
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

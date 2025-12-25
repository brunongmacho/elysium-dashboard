"use client";

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSelector() {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-primary/50 transition-all duration-200"
        title="Change theme"
      >
        <span className="text-xl">{themes[currentTheme].icon}</span>
        <span className="hidden sm:inline text-sm text-gray-300">Theme</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-72 rounded-lg glass-strong shadow-2xl border border-gray-700 z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white">Choose Theme</h3>
              <p className="text-xs text-gray-400 mt-1">Select your guild's color scheme</p>
            </div>

            <div className="p-2 max-h-96 overflow-y-auto">
              {Object.values(themes).map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => {
                    setTheme(theme.name);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 ${
                    currentTheme === theme.name
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-gray-800/50 border-2 border-transparent hover:bg-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Theme Icon */}
                    <div className="text-2xl">{theme.icon}</div>

                    {/* Theme Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {theme.label}
                        </span>
                        {currentTheme === theme.name && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {theme.description}
                      </p>
                    </div>

                    {/* Color Preview */}
                    <div className="flex gap-1">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-600"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primary color"
                      />
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-600"
                        style={{ backgroundColor: theme.colors.accent }}
                        title="Accent color"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-700 bg-gray-900/50">
              <p className="text-xs text-gray-500 text-center">
                Theme saved to your browser
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

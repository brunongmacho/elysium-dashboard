"use client";

import Image from "next/image";
import { guildTheme } from "@/lib/theme";

export default function GuildHeader() {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient opacity-50" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          {/* Guild branding */}
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
            {/* Guild icon with glow */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 glow-primary" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary/50 shadow-2xl">
                <Image
                  src={guildTheme.branding.logo}
                  alt={guildTheme.branding.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Guild name and tagline */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-glow mb-1 md:mb-2 leading-tight">
                {guildTheme.branding.name}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 font-medium">
                {guildTheme.branding.tagline}
              </p>
            </div>
          </div>

          {/* Optional: Quick stats or motto */}
          <div className="hidden lg:block glass rounded-lg p-4 border border-primary/30">
            <div className="flex items-center gap-3">
              <div className="text-center px-4 border-r border-gray-600">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
              <div className="text-center px-4 border-r border-gray-600">
                <div className="text-2xl font-bold text-accent">⚔️</div>
                <div className="text-xs text-gray-400">Victories</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-success">🏆</div>
                <div className="text-xs text-gray-400">Glory</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border with gradient */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </div>
  );
}

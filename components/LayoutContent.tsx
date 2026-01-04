/**
 * LayoutContent Component
 * Client-side layout content with theme-aware features
 */

'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import GuildHeader from '@/components/GuildHeader'
import BackToTop from '@/components/BackToTop'
import Footer from '@/components/Footer'
import { useNotificationTriggers } from '@/hooks/useNotificationTriggers'

// Lazy load BackgroundParticles for performance - reduces initial bundle size
const BackgroundParticles = dynamic(
  () => import('@/components/BackgroundParticles').then(mod => ({ default: mod.BackgroundParticles })),
  { ssr: false }
)

interface LayoutContentProps {
  children: ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  // Enable notification triggers
  useNotificationTriggers()

  return (
    <>
      {/* Animated Background Particles */}
      <BackgroundParticles
        density={50}
        speed={0.8}
        enableLinks={true}
        opacity={0.3}
        zIndex={-1}
      />

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="flex-1 flex flex-col animated-gradient relative">
        {/* Navigation */}
        <Navbar />

        {/* Guild Header Banner */}
        <GuildHeader />

        {/* Main Content */}
        <main id="main-content" className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative">{children}</div>
        </main>

        {/* Footer - sticky at bottom */}
        <Footer />

        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </>
  )
}

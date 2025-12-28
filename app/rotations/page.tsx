/**
 * Guild Alliance Rotation Page
 * Displays boss rotation schedule and current turn
 */

import { Metadata } from 'next'
import { BossRotationView } from '@/components/BossRotationView'

export const metadata: Metadata = {
  title: 'Boss Rotations - Elysium Dashboard',
  description: 'View guild alliance rotation schedule for world bosses',
}

export default function RotationsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white font-game-decorative mb-3 text-heading-1">
          🔄 Guild Alliance Rotations
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Track which guild has the current turn for each rotating boss. Coordinate with alliance members and plan your
          boss fights.
        </p>
      </div>

      {/* Rotation View */}
      <BossRotationView />
    </div>
  )
}

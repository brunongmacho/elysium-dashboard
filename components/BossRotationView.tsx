/**
 * BossRotationView Component
 * Displays guild rotation schedule with circular visualization
 */

'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import type { BossTimerDisplay } from '@/types/database'
import { RotationWheel } from './RotationWheel'
import { RotationTimeline } from './RotationTimeline'
import { Badge } from './ui'
import { useSSE, useRotationChanged } from '@/contexts/SSEContext'
import { AnimatedNumber } from './ui/AnimatedNumber'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function BossRotationView() {
  const [viewMode, setViewMode] = useState<'wheel' | 'timeline'>('wheel')

  // Fetch boss data with SWR
  const { data: bosses, error, mutate } = useSWR<BossTimerDisplay[]>('/api/bosses', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds as fallback
    revalidateOnFocus: true,
  })

  // Subscribe to SSE rotation changes
  const { state: sseState } = useSSE()

  useRotationChanged((data) => {
    console.log('[Rotation Changed]', data)
    // Revalidate data when rotation changes
    mutate()
  })

  // Filter bosses that have rotation data
  const rotatingBosses = bosses?.filter((boss) => boss.rotation?.isRotating) || []

  // Count bosses by turn status
  const ourTurnCount = rotatingBosses.filter((b) => b.rotation?.isOurTurn).length
  const totalRotatingCount = rotatingBosses.length

  if (error) {
    return (
      <div className="glass rounded-lg p-8 text-center">
        <div className="text-danger text-xl font-semibold mb-2">⚠️ Failed to load rotations</div>
        <div className="text-gray-400">{error.message}</div>
      </div>
    )
  }

  if (!bosses) {
    return (
      <div className="glass rounded-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (rotatingBosses.length === 0) {
    return (
      <div className="glass rounded-lg p-8 text-center">
        <div className="text-gray-400 text-lg">
          📋 No rotating bosses configured yet
          <br />
          <span className="text-sm">Rotation data will appear here when bosses are added to the rotation system</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Rotating Bosses */}
        <div className="glass rounded-lg p-6 text-center">
          <div className="text-gray-400 text-sm font-semibold mb-2">Total Rotating Bosses</div>
          <div className="text-4xl font-bold text-white font-game-decorative">
            <AnimatedNumber value={totalRotatingCount} duration={1} />
          </div>
        </div>

        {/* Our Turn Count */}
        <div className="glass rounded-lg p-6 text-center glow-success">
          <div className="text-gray-400 text-sm font-semibold mb-2">⭐ Our Turn</div>
          <div className="text-4xl font-bold text-success font-game-decorative">
            <AnimatedNumber value={ourTurnCount} duration={1} />
          </div>
        </div>

        {/* Other Guilds Turn */}
        <div className="glass rounded-lg p-6 text-center">
          <div className="text-gray-400 text-sm font-semibold mb-2">Other Guilds</div>
          <div className="text-4xl font-bold text-gray-300 font-game-decorative">
            <AnimatedNumber value={totalRotatingCount - ourTurnCount} duration={1} />
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {sseState.connected && (
        <div className="text-center">
          <Badge variant="success" size="sm" pulse>
            🔴 Live Updates
          </Badge>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setViewMode('wheel')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            viewMode === 'wheel'
              ? 'bg-primary text-white glow-primary'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🎡 Wheel View
        </button>
        <button
          onClick={() => setViewMode('timeline')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            viewMode === 'timeline'
              ? 'bg-primary text-white glow-primary'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          📊 Timeline View
        </button>
      </div>

      {/* Rotation Display */}
      <div className="space-y-6">
        {rotatingBosses.map((boss) => (
          <div key={boss.bossName} className="glass rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-game-decorative">{boss.bossName}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="primary" size="sm">
                    {boss.bossPoints} {boss.bossPoints === 1 ? 'pt' : 'pts'}
                  </Badge>
                  {boss.rotation?.isOurTurn && (
                    <Badge variant="success" size="sm" pulse className="glow-success">
                      ⭐ OUR TURN
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {viewMode === 'wheel' ? (
              <RotationWheel
                bossName={boss.bossName}
                currentGuild={boss.rotation?.currentGuild || ''}
                guilds={boss.rotation?.guilds || []}
                currentIndex={boss.rotation?.currentIndex || 0}
                isOurTurn={boss.rotation?.isOurTurn || false}
                nextGuild={boss.rotation?.nextGuild || ''}
              />
            ) : (
              <RotationTimeline
                bossName={boss.bossName}
                currentGuild={boss.rotation?.currentGuild || ''}
                guilds={boss.rotation?.guilds || []}
                currentIndex={boss.rotation?.currentIndex || 0}
                isOurTurn={boss.rotation?.isOurTurn || false}
                nextGuild={boss.rotation?.nextGuild || ''}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

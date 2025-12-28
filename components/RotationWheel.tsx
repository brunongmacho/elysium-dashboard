/**
 * RotationWheel Component
 * Circular visualization of guild rotation
 */

'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

export interface RotationWheelProps {
  bossName: string
  currentGuild: string
  guilds: string[]
  currentIndex: number
  isOurTurn: boolean
  nextGuild: string
}

export function RotationWheel({ currentGuild, guilds, currentIndex, isOurTurn, nextGuild }: RotationWheelProps) {
  // Calculate positions for guilds in a circle
  const guildPositions = useMemo(() => {
    const totalGuilds = guilds.length
    const radius = 120 // pixels
    const centerX = 150
    const centerY = 150

    return guilds.map((guild, index) => {
      // Start from top and go clockwise
      const angle = (index * 360) / totalGuilds - 90 // -90 to start from top
      const radian = (angle * Math.PI) / 180

      const x = centerX + radius * Math.cos(radian)
      const y = centerY + radius * Math.sin(radian)

      return {
        guild,
        x,
        y,
        isCurrent: index === currentIndex,
        isOurGuild: guild === 'ELYSIUM',
      }
    })
  }, [guilds, currentIndex])

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Circular Wheel */}
      <div className="relative" style={{ width: 300, height: 300 }}>
        <svg width="300" height="300" className="absolute inset-0">
          {/* Center Circle */}
          <circle cx="150" cy="150" r="50" fill="var(--color-bg-secondary)" stroke="var(--color-primary)" strokeWidth="2" />

          {/* Connection Lines */}
          {guildPositions.map((pos, index) => {
            const nextPos = guildPositions[(index + 1) % guildPositions.length]
            return (
              <line
                key={`line-${index}`}
                x1={pos.x}
                y1={pos.y}
                x2={nextPos.x}
                y2={nextPos.y}
                stroke={pos.isCurrent ? 'var(--color-success)' : 'var(--color-bg-tertiary)'}
                strokeWidth={pos.isCurrent ? 3 : 1}
                strokeDasharray={pos.isCurrent ? undefined : '5,5'}
                opacity={pos.isCurrent ? 1 : 0.3}
              />
            )
          })}

          {/* Arrow indicating direction */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              fill="var(--color-success)"
            >
              <polygon points="0 0, 10 3, 0 6" />
            </marker>
          </defs>
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Current Turn</div>
            <div className="text-sm font-bold text-white">{currentGuild}</div>
          </div>
        </div>

        {/* Guild Nodes */}
        {guildPositions.map((pos, index) => (
          <motion.div
            key={pos.guild}
            className="absolute"
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
          >
            <div
              className={`relative flex items-center justify-center w-16 h-16 rounded-full font-semibold text-xs text-center transition-all duration-300 ${
                pos.isCurrent
                  ? pos.isOurGuild
                    ? 'bg-success text-white glow-success scale-110'
                    : 'bg-primary text-white glow-primary scale-110'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {/* Pulse animation for current turn */}
              {pos.isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-success"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              <div className="z-10 px-1">
                {pos.guild === 'ELYSIUM' ? '⭐' : ''} {pos.guild}
              </div>
            </div>

            {/* Position Number */}
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
              #{index + 1}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-success"></div>
          <span className="text-gray-300">Our Turn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary"></div>
          <span className="text-gray-300">Current Turn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-700"></div>
          <span className="text-gray-300">Waiting</span>
        </div>
      </div>

      {/* Next Turn Info */}
      <div className="glass rounded-lg p-4 text-center w-full max-w-md">
        <div className="text-gray-400 text-sm mb-1">Next Turn</div>
        <div className="text-white font-semibold text-lg">→ {nextGuild}</div>
      </div>
    </div>
  )
}

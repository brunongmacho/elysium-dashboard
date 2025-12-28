/**
 * RotationTimeline Component
 * Linear timeline visualization of guild rotation
 */

'use client'

import { motion } from 'framer-motion'

export interface RotationTimelineProps {
  bossName: string
  currentGuild: string
  guilds: string[]
  currentIndex: number
  isOurTurn: boolean
  nextGuild: string
}

export function RotationTimeline({ guilds, currentIndex, isOurTurn }: RotationTimelineProps) {
  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-700"></div>
        <div
          className="absolute top-8 left-0 h-1 bg-gradient-to-r from-success to-primary transition-all duration-1000"
          style={{
            width: `${((currentIndex + 1) / guilds.length) * 100}%`,
          }}
        ></div>

        {/* Guild Nodes */}
        <div className="relative flex justify-between items-start">
          {guilds.map((guild, index) => {
            const isCurrent = index === currentIndex
            const isPast = index < currentIndex
            const isOurGuild = guild === 'ELYSIUM'
            const isFuture = index > currentIndex

            return (
              <motion.div
                key={guild}
                className="flex flex-col items-center gap-2 flex-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Node */}
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
                      isCurrent
                        ? isOurGuild
                          ? 'bg-success text-white glow-success scale-110'
                          : 'bg-primary text-white glow-primary scale-110'
                        : isPast
                        ? 'bg-gray-600 text-gray-400'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {/* Pulse for current */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2"
                        style={{
                          borderColor: isOurGuild ? 'var(--color-success)' : 'var(--color-primary)',
                        }}
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

                    {/* Check mark for past */}
                    {isPast ? (
                      <span className="text-xl">✓</span>
                    ) : isOurGuild ? (
                      <span className="text-xl">⭐</span>
                    ) : (
                      <span className="text-center px-1">{guild.slice(0, 8)}</span>
                    )}
                  </div>

                  {/* Position Badge */}
                  <div
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? 'bg-success text-white'
                        : isPast
                        ? 'bg-gray-500 text-gray-300'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Guild Name */}
                <div className="text-center">
                  <div
                    className={`font-semibold text-sm ${
                      isCurrent ? 'text-white' : isPast ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    {guild}
                  </div>

                  {/* Status Label */}
                  {isCurrent && (
                    <div className="mt-1">
                      <span className="text-xs px-2 py-1 rounded bg-success text-white font-semibold">
                        CURRENT
                      </span>
                    </div>
                  )}
                  {index === currentIndex + 1 && (
                    <div className="mt-1">
                      <span className="text-xs px-2 py-1 rounded bg-primary/50 text-white">NEXT</span>
                    </div>
                  )}
                  {isPast && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-500">COMPLETED</span>
                    </div>
                  )}
                  {isFuture && index !== currentIndex + 1 && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-600">WAITING</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Rotation Progress</span>
          <span className="text-white font-semibold">
            {currentIndex + 1} / {guilds.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-success to-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / guilds.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Guild List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {guilds.map((guild, index) => {
          const isCurrent = index === currentIndex
          const isOurGuild = guild === 'ELYSIUM'

          return (
            <div
              key={guild}
              className={`glass rounded-lg p-3 text-center transition-all duration-300 ${
                isCurrent ? 'glow-primary scale-105' : ''
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">Position {index + 1}</div>
              <div className={`font-semibold ${isCurrent ? 'text-white' : 'text-gray-300'}`}>
                {isOurGuild && '⭐ '}{guild}
              </div>
              {isCurrent && <div className="text-xs text-success mt-1">Active</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

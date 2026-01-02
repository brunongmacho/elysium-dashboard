/**
 * Client-side notification triggers
 * Detects boss spawns and event starts, triggers notifications
 */

'use client'

import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import { swrFetcher } from '@/lib/fetch-utils'
import { useNotifications } from '@/contexts/NotificationContext'
import { showBossSpawnNotification, showEventNotification } from '@/lib/notifications'
import { ALL_EVENTS } from '@/data/eventSchedules'
import { calculateNextOccurrence } from '@/lib/event-utils'
import type { BossTimersResponse } from '@/types/api'

interface BossState {
  [bossName: string]: 'spawned' | 'soon' | 'ready' | 'unknown'
}

interface EventState {
  [eventName: string]: 'active' | 'inactive'
}

/**
 * Hook that monitors boss and event states and triggers notifications
 */
export function useNotificationTriggers() {
  const { isEnabled, settings, permission } = useNotifications()
  const previousBossStates = useRef<BossState>({})
  const previousEventStates = useRef<EventState>({})
  const notificationCooldowns = useRef<Set<string>>(new Set())

  // Fetch boss data every 10 seconds
  const { data: bossData } = useSWR<BossTimersResponse>(
    isEnabled ? '/api/bosses' : null,
    swrFetcher,
    { refreshInterval: 10000 }
  )

  // Check for boss state changes
  useEffect(() => {
    if (!isEnabled || permission !== 'granted' || !bossData?.bosses) return

    bossData.bosses.forEach((boss) => {
      const previousState = previousBossStates.current[boss.bossName]
      const currentState = boss.status
      const cooldownKey = `boss-${boss.bossName}-${currentState}`

      // Detect boss spawned
      if (
        settings.bossSpawns &&
        currentState === 'spawned' &&
        previousState !== 'spawned' &&
        previousState !== undefined &&
        !notificationCooldowns.current.has(cooldownKey)
      ) {
        // Play notification sound
        playNotificationSound()

        // Show notification
        showBossSpawnNotification(boss.bossName)

        // Add cooldown (10 minutes)
        notificationCooldowns.current.add(cooldownKey)
        setTimeout(() => {
          notificationCooldowns.current.delete(cooldownKey)
        }, 10 * 60 * 1000)
      }

      // Detect boss soon (< 30 min)
      if (
        settings.bossSoon &&
        currentState === 'soon' &&
        previousState !== 'soon' &&
        previousState !== undefined &&
        !notificationCooldowns.current.has(cooldownKey)
      ) {
        // Calculate time remaining from next spawn time
        const timeRemaining = boss.nextSpawnTime ? new Date(boss.nextSpawnTime).getTime() - Date.now() : 0

        // Play notification sound
        playNotificationSound()

        // Show notification
        showBossSpawnNotification(boss.bossName, timeRemaining)

        // Add cooldown (30 minutes)
        notificationCooldowns.current.add(cooldownKey)
        setTimeout(() => {
          notificationCooldowns.current.delete(cooldownKey)
        }, 30 * 60 * 1000)
      }

      // Update previous state
      previousBossStates.current[boss.bossName] = currentState
    })
  }, [bossData, isEnabled, settings, permission])

  // Check for event state changes (every 10 seconds)
  useEffect(() => {
    if (!isEnabled || permission !== 'granted' || !settings.events) return

    const checkEvents = () => {
      const now = Date.now()

      ALL_EVENTS.forEach((event) => {
        const nextOcc = calculateNextOccurrence(event, now)
        const timeUntil = nextOcc.getTime() - now
        const eventEndTime = nextOcc.getTime() + event.durationMinutes * 60 * 1000
        const isActive = timeUntil < 0 && now < eventEndTime
        const previousState = previousEventStates.current[event.name]
        const currentState = isActive ? 'active' : 'inactive'
        const cooldownKey = `event-${event.name}-active`

        // Detect event became active
        if (
          isActive &&
          previousState === 'inactive' &&
          !notificationCooldowns.current.has(cooldownKey)
        ) {
          // Play notification sound
          playNotificationSound()

          // Show notification
          showEventNotification(event.name)

          // Add cooldown (event duration + 5 minutes)
          notificationCooldowns.current.add(cooldownKey)
          setTimeout(() => {
            notificationCooldowns.current.delete(cooldownKey)
          }, (event.durationMinutes + 5) * 60 * 1000)
        }

        // Update previous state
        previousEventStates.current[event.name] = currentState
      })
    }

    // Check immediately
    checkEvents()

    // Then check every 10 seconds
    const interval = setInterval(checkEvents, 10000)

    return () => clearInterval(interval)
  }, [isEnabled, settings.events, permission])
}

/**
 * Play notification sound
 */
function playNotificationSound() {
  try {
    // Create a simple notification beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800 // Higher pitch for attention
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.warn('Could not play notification sound:', error)
  }
}

/**
 * BackgroundParticles Component
 * Theme-aware animated particle background
 */

'use client'

import { useCallback, useMemo } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine, ISourceOptions } from '@tsparticles/engine'
import { useTheme } from '@/contexts/ThemeContext'

export interface BackgroundParticlesProps {
  /**
   * Particle density (number of particles)
   * @default 50
   */
  density?: number

  /**
   * Particle speed
   * @default 1
   */
  speed?: number

  /**
   * Enable links between particles
   * @default true
   */
  enableLinks?: boolean

  /**
   * Opacity of particles
   * @default 0.5
   */
  opacity?: number

  /**
   * Custom z-index
   * @default -1
   */
  zIndex?: number
}

export function BackgroundParticles({
  density = 50,
  speed = 1,
  enableLinks = true,
  opacity = 0.5,
  zIndex = -1,
}: BackgroundParticlesProps) {
  const { currentTheme, themes } = useTheme()
  const theme = themes[currentTheme]

  /**
   * Initialize particles engine
   */

  /**
   * Particle configuration based on current theme
   */
  const particlesOptions = useMemo<ISourceOptions>(() => {
    // Get theme colors
    const primaryColor = theme.colors.primary
    const accentColor = theme.colors.accent

    return {
      background: {
        opacity: 0, // Transparent background
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: density,
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
        },
        color: {
          value: [primaryColor, accentColor],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: opacity,
          random: {
            enable: true,
            minimumValue: 0.1,
          },
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.1,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          random: {
            enable: true,
            minimumValue: 1,
          },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.5,
            sync: false,
          },
        },
        links: enableLinks
          ? {
              enable: true,
              color: primaryColor,
              distance: 150,
              opacity: 0.2,
              width: 1,
            }
          : {
              enable: false,
            },
        move: {
          enable: true,
          speed: speed,
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
          attract: {
            enable: false,
          },
        },
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: {
            enable: true,
            mode: 'grab',
          },
          resize: {
            enable: true,
            delay: 0.5,
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.3,
            },
          },
        },
      },
      detectRetina: true,
    }
  }, [theme, density, speed, enableLinks, opacity])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex,
        pointerEvents: 'none',
      }}
    >
      <Particles
        id="background-particles"
        
        options={particlesOptions}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}

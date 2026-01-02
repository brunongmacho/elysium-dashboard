/**
 * Notification Button - Toggle browser notifications with settings dropdown
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useNotificationTriggers } from '@/hooks/useNotificationTriggers'
import { Icon } from './icons'
import Tooltip from './Tooltip'

export default function NotificationButton() {
  const { isSupported, permission, isEnabled, settings, toggleNotifications, updateSettings } =
    useNotifications()
  const { themes, currentTheme } = useTheme()
  const theme = themes[currentTheme]
  const monitoringStatus = useNotificationTriggers()
  const [showSettings, setShowSettings] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSettings(false)
      }
    }

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSettings])

  // Don't render if not supported (check after all hooks)
  if (!isSupported) {
    return null
  }

  // Calculate how many notification types are enabled
  const enabledCount = isEnabled
    ? [settings.bossSpawns, settings.bossSoon, settings.events].filter(Boolean).length
    : 0

  // Check if all settings are enabled or disabled
  const allEnabled = settings.bossSpawns && settings.bossSoon && settings.events
  const allDisabled = !settings.bossSpawns && !settings.bossSoon && !settings.events

  const handleButtonClick = async () => {
    if (permission === 'denied') {
      alert(
        'Notifications are blocked. Please enable them in your browser settings:\n\n' +
          '1. Click the lock icon in the address bar\n' +
          '2. Find "Notifications" and change to "Allow"\n' +
          '3. Refresh the page'
      )
      return
    }

    // Request permission if not granted
    if (permission === 'default') {
      await toggleNotifications(true)
    }

    // Always show dropdown when clicking
    setShowSettings(!showSettings)
  }

  const handleToggleAll = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (allEnabled) {
      // Disable all
      updateSettings({
        bossSpawns: false,
        bossSoon: false,
        events: false,
      })
      toggleNotifications(false)
    } else {
      // Enable all
      updateSettings({
        bossSpawns: true,
        bossSoon: true,
        events: true,
      })
      toggleNotifications(true)
    }
  }

  const getTooltipText = () => {
    if (permission === 'denied') return 'Notifications blocked - check browser settings'
    if (!isEnabled || enabledCount === 0) return 'Enable notifications for bosses & events'
    if (enabledCount === 1) return '1 notification type enabled - click to configure'
    if (enabledCount === 2) return '2 notification types enabled - click to configure'
    return 'All notifications enabled - click to configure'
  }

  const getIconName = (): 'bell' | 'bell-off' | 'bell-on' => {
    if (permission === 'denied') return 'bell-off'
    if (!isEnabled || enabledCount === 0) return 'bell'
    return 'bell-on'
  }

  // Get glow intensity based on enabled count
  const getGlowIntensity = () => {
    if (!isEnabled || enabledCount === 0) return 'opacity-50'
    if (enabledCount === 1) return 'opacity-70'
    if (enabledCount === 2) return 'opacity-90'
    return 'opacity-100'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip content={getTooltipText()} position="bottom">
        <button
          onClick={handleButtonClick}
          className={`
            p-2 rounded-md transition-all duration-200 relative
            ${
              enabledCount > 0
                ? 'text-primary hover:text-primary-light bg-primary/10 hover:bg-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }
            ${permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          aria-label={enabledCount > 0 ? 'Configure notifications' : 'Enable notifications'}
        >
          <Icon
            name={getIconName()}
            size="md"
            className={`${getGlowIntensity()} ${enabledCount > 0 && !showSettings ? 'animate-pulse' : ''}`}
            style={{
              filter:
                enabledCount > 0 && !showSettings
                  ? `drop-shadow(0 0 ${2 * enabledCount}px ${theme.colors.primary}) drop-shadow(0 0 ${4 * enabledCount}px ${theme.colors.primary})`
                  : 'none',
            }}
          />
        </button>
      </Tooltip>

      {/* Settings Dropdown */}
      {showSettings && permission !== 'denied' && (
        <div
          className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 glass backdrop-blur-sm border rounded-lg shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto"
          style={{
            borderColor: `${theme.colors.primary}33`,
            backgroundColor: '#1f2937f0',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="text-white font-semibold font-game text-sm sm:text-base">
              Notification Settings
            </div>
            <button
              onClick={handleToggleAll}
              className={`text-xs transition-colors whitespace-nowrap ${
                allEnabled
                  ? 'text-danger hover:text-danger-light'
                  : 'text-success hover:text-success-light'
              }`}
            >
              {allEnabled ? 'Disable All' : 'Enable All'}
            </button>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3">
            {/* Boss Spawned */}
            <ToggleSwitch
              label="Boss Spawned"
              description="When a boss spawns"
              checked={settings.bossSpawns}
              onChange={(checked) => updateSettings({ bossSpawns: checked })}
              theme={theme}
            />

            {/* Boss Soon */}
            <ToggleSwitch
              label="Boss Soon"
              description="Boss spawning within 30 min"
              checked={settings.bossSoon}
              onChange={(checked) => updateSettings({ bossSoon: checked })}
              theme={theme}
            />

            {/* Events */}
            <ToggleSwitch
              label="Events"
              description="Event starting or active"
              checked={settings.events}
              onChange={(checked) => updateSettings({ events: checked })}
              theme={theme}
            />
          </div>

          {/* Diagnostic Status */}
          <div
            className="mt-4 pt-4 border-t"
            style={{ borderColor: `${theme.colors.primary}22` }}
          >
            <div className="text-xs font-game text-gray-400 space-y-1.5">
              <div className="flex justify-between">
                <span>Monitoring:</span>
                <span
                  className="font-semibold"
                  style={{
                    color: monitoringStatus.isMonitoring ? theme.colors.primary : theme.colors.danger,
                  }}
                >
                  {monitoringStatus.isMonitoring ? '✓ Active' : '✗ Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Permission:</span>
                <span
                  className="font-semibold"
                  style={{
                    color:
                      permission === 'granted'
                        ? theme.colors.primary
                        : permission === 'default'
                          ? theme.colors.warning
                          : theme.colors.danger,
                  }}
                >
                  {permission}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tracking Bosses:</span>
                <span className="font-semibold text-white">{monitoringStatus.bossCount}</span>
              </div>
              {monitoringStatus.bossCount > 0 && (
                <div className="mt-2 pt-2 border-t" style={{ borderColor: `${theme.colors.primary}11` }}>
                  <div className="text-xs text-gray-500 mb-1">Boss States:</div>
                  <div className="space-y-0.5">
                    {Object.entries(monitoringStatus.bossStates).map(([bossName, state]) => (
                      <div key={bossName} className="flex justify-between text-xs">
                        <span className="text-gray-400">{bossName}:</span>
                        <span
                          className="font-semibold"
                          style={{
                            color:
                              state === 'spawned'
                                ? theme.colors.danger
                                : state === 'soon'
                                  ? theme.colors.warning
                                  : theme.colors.primary,
                          }}
                        >
                          {state}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Theme-aware Toggle Switch Component
interface ToggleSwitchProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  theme: any
}

function ToggleSwitch({ label, description, checked, onChange, theme }: ToggleSwitchProps) {
  const handleToggle = () => {
    onChange(!checked)
  }

  return (
    <div className="flex items-center justify-between group">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white group-hover:text-primary transition-colors font-game">
          {label}
        </div>
        <div className="text-xs text-gray-400 break-words">{description}</div>
      </div>

      {/* Toggle Switch */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${label}`}
        onClick={handleToggle}
        className="relative ml-3 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full transition-all duration-200"
        style={{
          width: '44px',
          height: '24px',
          backgroundColor: checked ? theme.colors.primary : '#4B5563',
          boxShadow: checked ? `0 0 10px ${theme.colors.primary}66` : 'none',
          outlineColor: theme.colors.primary,
        }}
      >
        <span
          className="absolute left-0.5 top-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out"
          style={{
            width: '20px',
            height: '20px',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </button>
    </div>
  )
}

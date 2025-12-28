/**
 * Notification Button - Toggle browser notifications with settings dropdown
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Icon } from './icons'
import Tooltip from './Tooltip'

export default function NotificationButton() {
  const { isSupported, permission, isEnabled, settings, toggleNotifications, updateSettings } =
    useNotifications()
  const { themes, currentTheme } = useTheme()
  const theme = themes[currentTheme]
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

    if (!isEnabled) {
      // If disabled, enable notifications
      toggleNotifications(true)
    } else {
      // If enabled, show settings dropdown
      setShowSettings(!showSettings)
    }
  }

  const getTooltipText = () => {
    if (permission === 'denied') return 'Notifications blocked - check browser settings'
    if (!isEnabled) return 'Enable notifications for bosses & events'
    return 'Notifications enabled - click to configure'
  }

  const getIconName = (): 'bell' | 'bell-off' | 'bell-on' => {
    if (permission === 'denied') return 'bell-off'
    if (!isEnabled) return 'bell'
    return 'bell-on'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip content={getTooltipText()} position="bottom">
        <button
          onClick={handleButtonClick}
          className={`
            p-2 rounded-md transition-all duration-200
            ${
              isEnabled
                ? 'text-primary hover:text-primary-light bg-primary/10 hover:bg-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }
            ${permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          aria-label={isEnabled ? 'Configure notifications' : 'Enable notifications'}
        >
          <Icon
            name={getIconName()}
            size="md"
            className={isEnabled && !showSettings ? 'animate-pulse' : ''}
          />
        </button>
      </Tooltip>

      {/* Settings Dropdown */}
      {showSettings && isEnabled && (
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
              onClick={() => toggleNotifications(false)}
              className="text-xs text-danger hover:text-danger-light transition-colors whitespace-nowrap"
            >
              Disable All
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

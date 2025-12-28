/**
 * Notification Button - Toggle browser notifications
 */

'use client'

import { useState } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'
import { Icon } from './icons'
import Tooltip from './Tooltip'

export default function NotificationButton() {
  const { isSupported, permission, isEnabled, settings, toggleNotifications, updateSettings } =
    useNotifications()
  const [showSettings, setShowSettings] = useState(false)

  // Don't render if not supported
  if (!isSupported) {
    return null
  }

  const handleToggle = async () => {
    if (permission === 'denied') {
      alert(
        'Notifications are blocked. Please enable them in your browser settings:\n\n' +
          '1. Click the lock icon in the address bar\n' +
          '2. Find "Notifications" and change to "Allow"\n' +
          '3. Refresh the page'
      )
      return
    }

    toggleNotifications(!isEnabled)
  }

  const getTooltipText = () => {
    if (permission === 'denied') return 'Notifications blocked - check browser settings'
    if (!isEnabled) return 'Enable notifications for boss spawns'
    return 'Notifications enabled - click to configure'
  }

  const getIconName = (): 'bell' | 'bell-off' | 'bell-on' => {
    if (permission === 'denied') return 'bell-off'
    if (!isEnabled) return 'bell'
    return 'bell-on'
  }

  return (
    <div className="relative">
      <Tooltip content={getTooltipText()} position="bottom">
        <button
          onClick={handleToggle}
          className={`
            p-2 rounded-md transition-all duration-200
            ${
              isEnabled
                ? 'text-primary hover:text-primary-light bg-primary/10 hover:bg-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }
            ${permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          aria-label={isEnabled ? 'Disable notifications' : 'Enable notifications'}
        >
          <Icon
            name={getIconName()}
            size="md"
            className={isEnabled ? 'animate-pulse' : ''}
          />
        </button>
      </Tooltip>

      {/* Settings Popover (future enhancement) */}
      {showSettings && (
        <div className="absolute right-0 mt-2 w-64 glass backdrop-blur-sm border border-primary/20 rounded-lg shadow-lg p-4 z-50">
          <div className="text-white font-semibold mb-3">Notification Settings</div>
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-300">Boss Spawned</span>
              <input
                type="checkbox"
                checked={settings.bossSpawns}
                onChange={(e) => updateSettings({ bossSpawns: e.target.checked })}
                className="form-checkbox h-4 w-4 text-primary rounded border-gray-600 bg-gray-700 focus:ring-primary focus:ring-offset-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-300">Boss Soon (&lt;30min)</span>
              <input
                type="checkbox"
                checked={settings.bossSoon}
                onChange={(e) => updateSettings({ bossSoon: e.target.checked })}
                className="form-checkbox h-4 w-4 text-primary rounded border-gray-600 bg-gray-700 focus:ring-primary focus:ring-offset-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-300">Events</span>
              <input
                type="checkbox"
                checked={settings.events}
                onChange={(e) => updateSettings({ events: e.target.checked })}
                className="form-checkbox h-4 w-4 text-primary rounded border-gray-600 bg-gray-700 focus:ring-primary focus:ring-offset-0"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

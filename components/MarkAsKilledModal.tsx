"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";

interface MarkAsKilledModalProps {
  bossName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (killedBy: string, killTime?: string, spawnTime?: string) => void;
}

export default function MarkAsKilledModal({
  bossName,
  isOpen,
  onClose,
  onConfirm,
}: MarkAsKilledModalProps) {
  const [killedBy, setKilledBy] = useState("");
  const [useCurrentTime, setUseCurrentTime] = useState(true);
  const [killTime, setKillTime] = useState("");
  const [spawnTime, setSpawnTime] = useState("");
  const [setMode, setSetMode] = useState<"kill" | "spawn">("kill");
  const [mounted, setMounted] = useState(false);

  // Handle mounting for SSR compatibility
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize with current time when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      // Format for datetime-local input: YYYY-MM-DDThh:mm
      const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm");
      setKillTime(formattedTime);
      setSpawnTime(formattedTime);
      setKilledBy("");
      setUseCurrentTime(true);
      setSetMode("kill");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!killedBy.trim()) {
      alert("Please enter who killed the boss");
      return;
    }

    if (setMode === "kill") {
      // Set kill time mode - spawn time will be calculated
      const timeToSend = useCurrentTime ? undefined : killTime;
      onConfirm(killedBy.trim(), timeToSend, undefined);
    } else {
      // Set spawn time mode - directly set when boss will spawn
      onConfirm(killedBy.trim(), undefined, spawnTime);
    }
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative z-[10000]">
        <h2 className="text-2xl font-bold text-white mb-4">
          Mark {bossName} as Killed
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Killed By Input */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Who killed the boss? *
            </label>
            <input
              type="text"
              value={killedBy}
              onChange={(e) => setKilledBy(e.target.value)}
              placeholder="Enter player name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              required
            />
          </div>

          {/* Mode Selection */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              What do you want to set?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSetMode("kill")}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  setMode === "kill"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Kill Time
              </button>
              <button
                type="button"
                onClick={() => setSetMode("spawn")}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  setMode === "spawn"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Spawn Time
              </button>
            </div>
          </div>

          {/* Kill Time Mode */}
          {setMode === "kill" && (
            <>
              {/* Use Current Time Checkbox */}
              <div className="mb-4">
                <label className="flex items-center text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCurrentTime}
                    onChange={(e) => setUseCurrentTime(e.target.checked)}
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">Use current time (now)</span>
                </label>
              </div>

              {/* Kill Time Input */}
              {!useCurrentTime && (
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    When was it killed?
                  </label>
                  <input
                    type="datetime-local"
                    value={killTime}
                    onChange={(e) => setKillTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!useCurrentTime}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Spawn time will be calculated automatically
                  </p>
                </div>
              )}
            </>
          )}

          {/* Spawn Time Mode */}
          {setMode === "spawn" && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                When will it spawn?
              </label>
              <input
                type="datetime-local"
                value={spawnTime}
                onChange={(e) => setSpawnTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Set exact spawn time directly
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

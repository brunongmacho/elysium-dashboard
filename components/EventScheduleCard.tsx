"use client";

import { useMemo, memo } from "react";
import CircularProgress from "./CircularProgress";
import { Badge } from "./ui";
import Tooltip from "./Tooltip";
import type { EventSchedule } from "@/types/eventSchedule";
import { formatInGMT8 } from "@/lib/timezone";
import { formatTimeRemaining } from "@/lib/boss-config";
import { useTimer } from "@/contexts/TimerContext";
import { calculateEventGlow, generateGlowStyle } from "@/lib/event-glow";
import { calculateNextOccurrence, formatEventDays } from "@/lib/event-utils";

interface EventScheduleCardProps {
  event: EventSchedule;
}

function EventScheduleCard({ event }: EventScheduleCardProps) {
  const { currentTime } = useTimer();

  // Calculate next occurrence and time remaining
  const { nextOccurrence, timeRemaining, isActive, progressPercentage, status } = useMemo(() => {
    const nextOcc = calculateNextOccurrence(event, currentTime);
    const remaining = nextOcc.getTime() - currentTime;

    // Check if event is currently active
    const eventEndTime = nextOcc.getTime() + (event.durationMinutes * 60 * 1000);
    const active = remaining < 0 && currentTime < eventEndTime;

    // Calculate progress percentage for countdown
    const twentyFourHours = 24 * 60 * 60 * 1000;
    let percentage = 0;

    if (active) {
      // Event is active, show progress through event duration
      const eventDuration = event.durationMinutes * 60 * 1000;
      const elapsed = currentTime - nextOcc.getTime();
      percentage = (elapsed / eventDuration) * 100;
    } else if (remaining <= 0) {
      // Event just finished
      percentage = 100;
    } else if (remaining >= twentyFourHours) {
      // More than 24 hours away
      percentage = 0;
    } else {
      // Within 24 hours, show countdown progress
      percentage = ((twentyFourHours - remaining) / twentyFourHours) * 100;
    }

    // Determine status for CircularProgress (matches boss timer logic)
    let eventStatus: 'spawned' | 'soon' | 'ready' = 'ready';
    if (active) {
      eventStatus = 'spawned';
    } else if (remaining <= 30 * 60 * 1000) {
      // Within 30 minutes
      eventStatus = 'soon';
    }

    return {
      nextOccurrence: nextOcc,
      timeRemaining: active ? eventEndTime - currentTime : remaining,
      isActive: active,
      progressPercentage: percentage,
      status: eventStatus,
    };
  }, [event, currentTime]);

  // Format days for display
  const daysDisplay = formatEventDays(event.days, event.isDaily);

  // Calculate dynamic glow based on time remaining
  const { borderColor, glowStyle } = useMemo(() => {
    if (isActive) {
      return {
        borderColor: 'border-green-500',
        glowStyle: generateGlowStyle('#10b981', 80),
      };
    }
    const glowData = calculateEventGlow(timeRemaining);
    return {
      borderColor: glowData.borderColor,
      glowStyle: generateGlowStyle(glowData.color, glowData.intensity),
    };
  }, [timeRemaining, isActive]);

  return (
    <div
      className={`glass backdrop-blur-sm rounded-lg border-2 ${borderColor} shadow-lg p-4 card-3d transition-all duration-1000 overflow-visible h-full flex flex-col`}
      style={{
        boxShadow: glowStyle,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-lg font-bold font-game-decorative ${isActive ? 'text-energy text-green-400' : 'text-white'}`}>
            {event.icon} {event.name}
            <span className="sr-only">
              {isActive ? ', Status: Active Now' : ', Status: Upcoming'}
            </span>
          </h3>
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <Tooltip content={event.isDaily ? "Occurs every day" : `Occurs on: ${daysDisplay}`} position="bottom">
              <Badge variant={event.isDaily ? "success" : "primary"} size="sm" className="cursor-help">
                {daysDisplay}
              </Badge>
            </Tooltip>
            <Tooltip content={`Event duration: ${event.durationMinutes} minutes`} position="bottom">
              <Badge variant="warning" size="sm" className="cursor-help">
                {event.durationMinutes}m
              </Badge>
            </Tooltip>
            {isActive && (
              <Badge variant="success" size="sm" pulse className="glow-success font-semibold">
                🎮 ACTIVE NOW
              </Badge>
            )}
          </div>
        </div>

        {/* Event Icon Display */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl">
          {event.icon}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Event Time Info */}
        <div className="mb-3 p-2 bg-gray-700/50 rounded text-sm">
          <div className="text-gray-300">
            <span className="text-gray-400">🕐 Start Time (GMT+8):</span>{" "}
            <span className="font-semibold">
              {String(event.startTime.hour).padStart(2, '0')}:{String(event.startTime.minute).padStart(2, '0')}
            </span>
          </div>
          <div className="text-gray-300">
            <span className="text-gray-400">📅 Schedule:</span>{" "}
            <span className="font-semibold">{daysDisplay}</span>
          </div>
        </div>

        {/* Next Occurrence */}
        <div className="mb-2">
          <div className="text-xs sm:text-sm font-semibold text-gray-300 mb-1">
            {isActive ? "🎮 Event Active - Ends:" : "⏰ Next Occurrence:"}
          </div>
          <div className="text-white text-sm sm:text-base font-bold mb-2">
            {formatInGMT8(
              isActive ? new Date(nextOccurrence.getTime() + event.durationMinutes * 60 * 1000) : nextOccurrence,
              "MMM dd, yyyy hh:mm a"
            )}
          </div>

          {/* Countdown Timer with Circular Progress */}
          <div className="flex justify-center py-2">
            <div className="relative">
              <CircularProgress
                percentage={progressPercentage}
                size={140}
                strokeWidth={8}
                status={status}
                timeRemaining={timeRemaining}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1 font-game">
                    {isActive ? 'Time Left' : 'Countdown'}
                  </div>
                  <div className="font-mono text-lg sm:text-xl font-bold text-white leading-tight font-game-decorative">
                    {timeRemaining !== null
                      ? formatTimeRemaining(timeRemaining)
                      : "--:--:--"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Color Badge */}
        <div className="text-center mb-2">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: event.color }}
          >
            {event.name}
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(EventScheduleCard, (prevProps, nextProps) => {
  return prevProps.event.id === nextProps.event.id;
});

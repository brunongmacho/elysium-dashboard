"use client";

import { useMemo } from "react";
import EventScheduleCard from "@/components/EventScheduleCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import Tooltip from "@/components/Tooltip";
import NotificationButton from "@/components/NotificationButton";
import { Breadcrumb, Typography } from "@/components/ui";
import { Stack, Grid } from "@/components/layout";
import { TimerProvider, useTimer } from "@/contexts/TimerContext";
import { ALL_EVENTS } from "@/data/eventSchedules";
import { calculateNextOccurrence } from "@/lib/event-utils";

function EventScheduleContent() {
  const { currentTime } = useTimer();

  // Calculate event statistics
  const stats = useMemo(() => {
    const now = currentTime;
    let activeCount = 0;
    let soonCount = 0; // Within 1 hour
    let todayCount = 0;

    ALL_EVENTS.forEach((event) => {
      const nextOcc = calculateNextOccurrence(event, now);
      const timeUntil = nextOcc.getTime() - now;
      const eventEndTime = nextOcc.getTime() + (event.durationMinutes * 60 * 1000);

      // Check if currently active
      if (timeUntil < 0 && now < eventEndTime) {
        activeCount++;
      }

      // Check if coming soon (within 1 hour)
      if (timeUntil > 0 && timeUntil <= 60 * 60 * 1000) {
        soonCount++;
      }

      // Check if today
      const nowDate = new Date(now);
      const nextDate = new Date(nextOcc);
      if (
        nowDate.getFullYear() === nextDate.getFullYear() &&
        nowDate.getMonth() === nextDate.getMonth() &&
        nowDate.getDate() === nextDate.getDate()
      ) {
        todayCount++;
      }
    });

    return {
      total: ALL_EVENTS.length,
      active: activeCount,
      soon: soonCount,
      today: todayCount,
    };
  }, [currentTime]);

  // Sort events by next occurrence
  const sortedEvents = useMemo(() => {
    return [...ALL_EVENTS].sort((a, b) => {
      const nextA = calculateNextOccurrence(a, currentTime);
      const nextB = calculateNextOccurrence(b, currentTime);
      return nextA.getTime() - nextB.getTime();
    });
  }, [currentTime]);

  return (
    <Stack gap="lg">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Event Schedule', current: true },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <Stack gap="sm">
          <Typography variant="h1" className="text-2xl sm:text-3xl md:text-4xl text-gold">
            Event Schedule
          </Typography>
          <Typography variant="body" className="text-sm sm:text-base text-gray-300">
            Daily and weekly game event countdowns (GMT+8)
          </Typography>
        </Stack>
        <NotificationButton />
      </div>

      {/* Stats Bar */}
      <Grid columns={{ xs: 2, md: 4 }} gap="md">
        <Tooltip content="All scheduled events being tracked" fullWidth>
          <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-3 sm:p-4 text-center hover:scale-105 transition-transform duration-200 cursor-help">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary font-game-decorative">
              <AnimatedCounter value={stats.total} />
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">Total Events</div>
          </div>
        </Tooltip>
        <Tooltip content="Events currently active - join now!" fullWidth>
          <div className="glass backdrop-blur-sm rounded-lg border border-success p-3 sm:p-4 text-center glow-success hover:scale-105 transition-transform duration-200 cursor-help">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-success font-game-decorative">
              <AnimatedCounter value={stats.active} />
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">Active Now</div>
          </div>
        </Tooltip>
        <Tooltip content="Events starting within 1 hour - get ready!" fullWidth>
          <div className="glass backdrop-blur-sm rounded-lg border border-accent p-3 sm:p-4 text-center glow-accent hover:scale-105 transition-transform duration-200 cursor-help">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent font-game-decorative">
              <AnimatedCounter value={stats.soon} />
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">Soon (&lt;1hr)</div>
          </div>
        </Tooltip>
        <Tooltip content="Events happening today" fullWidth>
          <div className="glass backdrop-blur-sm rounded-lg border border-primary p-3 sm:p-4 text-center glow-primary hover:scale-105 transition-transform duration-200 cursor-help">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary font-game-decorative">
              <AnimatedCounter value={stats.today} />
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-game">Today</div>
          </div>
        </Tooltip>
      </Grid>

      {/* Event Schedule Grid */}
      <Grid columns={{ xs: 1, sm: 2, lg: 3, xl: 4 }} gap="md">
        {sortedEvents.map((event) => (
          <EventScheduleCard key={event.id} event={event} />
        ))}
      </Grid>

      {/* Info Note */}
      <Typography variant="caption" className="text-center text-gray-500">
        All times are in GMT+8 (Asia/Manila timezone). Events automatically refresh every second.
      </Typography>
    </Stack>
  );
}

export default function EventSchedulePage() {
  return (
    <TimerProvider>
      <EventScheduleContent />
    </TimerProvider>
  );
}

"use client";

import { useMemo } from "react";

interface CircularProgressProps {
  percentage: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  status?: "spawned" | "soon" | "ready" | "unknown";
  showPercentage?: boolean;
  className?: string;
}

export default function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  status = "ready",
  showPercentage = false,
  className = "",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on status
  const strokeColor = useMemo(() => {
    switch (status) {
      case "spawned":
        return "stroke-danger";
      case "soon":
        return "stroke-warning";
      case "ready":
        return "stroke-success";
      default:
        return "stroke-gray-500";
    }
  }, [status]);

  const glowColor = useMemo(() => {
    switch (status) {
      case "spawned":
        return "#ef4444";
      case "soon":
        return "#f59e0b";
      case "ready":
        return "#10b981";
      default:
        return "#6b7280";
    }
  }, [status]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-700"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${strokeColor} transition-all duration-500 ease-out`}
          style={{
            filter: `drop-shadow(0 0 6px ${glowColor})`,
          }}
        />
      </svg>

      {/* Percentage text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

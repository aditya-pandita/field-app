"use client";

import { useMemo } from "react";

interface AudioWaveformProps {
  amplitude?: number;
}

export function AudioWaveform({ amplitude = 0 }: AudioWaveformProps) {
  const bars = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const variation = Math.random() * 0.3 + 0.7;
      const height = 4 + amplitude * 48 * variation;
      return height;
    });
  }, [amplitude]);

  return (
    <div className="hidden sm:flex items-center justify-center gap-[3px] h-24 w-32 mx-auto">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-[3px] bg-[#FF5500] rounded-none"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}

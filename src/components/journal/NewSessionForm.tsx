"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSession } from "@/lib/firebase/queries/sessions";
import type { LocationType, WeatherType, TimeOfDay, NewSession } from "@/lib/firebase/types";

const LOCATIONS = [
  { value: "street", label: "Street" },
  { value: "mall", label: "Mall" },
  { value: "cafe", label: "Cafe" },
  { value: "park", label: "Park" },
  { value: "transit", label: "Transit" },
  { value: "market", label: "Market" },
  { value: "university", label: "University" },
  { value: "other", label: "Other" },
];

const WEATHER_OPTIONS = [
  { value: "sunny", label: "Sunny" },
  { value: "cloudy", label: "Cloudy" },
  { value: "overcast", label: "Overcast" },
  { value: "cold", label: "Cold" },
  { value: "hot", label: "Hot" },
  { value: "rainy", label: "Rainy" },
];

const TIME_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "midday", label: "Midday" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

const MOODS = [
  { value: "confident", label: "Confident", emoji: "🔥" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "tired", label: "Tired", emoji: "😴" },
  { value: "excited", label: "Excited", emoji: "⚡" },
];

interface NewSessionFormProps {
  userId: string;
}

export function NewSessionForm({ userId }: NewSessionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [sessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [locationType, setLocationType] = useState<LocationType>("street");
  const [locationName, setLocationName] = useState("");
  const [weather, setWeather] = useState<WeatherType>("sunny");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("afternoon");
  const [moodBefore, setMoodBefore] = useState("neutral");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sessionData: NewSession = {
        sessionDate: new Date(sessionDate),
        locationType,
        locationName,
        weather,
        timeOfDay,
        moodBefore,
        notes,
      };
      const session = await createSession(userId, sessionData);
      router.push(`/sessions/${session.sessionId}`);
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Date
        </label>
        <input
          type="date"
          value={sessionDate}
          onChange={() => {}}
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-2 focus:outline-none focus:border-[#FF5500]"
        />
      </div>

      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Location Type
        </label>
        <select
          value={locationType}
          onChange={(e) => setLocationType(e.target.value as LocationType)}
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-2 focus:outline-none focus:border-[#FF5500]"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc.value} value={loc.value}>{loc.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Location Name
        </label>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="e.g., Main St, Central Mall"
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-2 placeholder:text-[#666666] focus:outline-none focus:border-[#FF5500]"
        />
      </div>

      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Weather
        </label>
        <select
          value={weather}
          onChange={(e) => setWeather(e.target.value as WeatherType)}
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-2 focus:outline-none focus:border-[#FF5500]"
        >
          {WEATHER_OPTIONS.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Time of Day
        </label>
        <select
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-2 focus:outline-none focus:border-[#FF5500]"
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Mood Before
        </label>
        <div className="flex gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => setMoodBefore(mood.value)}
              className={`w-9 h-9 border flex items-center justify-center text-lg transition-all ${
                moodBefore === mood.value
                  ? "border-[#FF5500] bg-[#FF5500]/10"
                  : "border-[#252525] bg-[#1A1A1A] hover:border-[#333333]"
              }`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any notes about this session..."
          className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-2 placeholder:text-[#666666] focus:outline-none focus:border-[#FF5500] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] uppercase tracking-widest py-3 hover:bg-[#E64D00] transition-colors disabled:opacity-50"
      >
        {loading ? "Creating..." : "Start Session"}
      </button>
    </form>
  );
}

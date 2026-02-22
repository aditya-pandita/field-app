"use client";

// src/components/journal/EditSessionForm.tsx
// Pre-filled session edit form. Calls updateSession() on save.

import { useState } from "react";
import { updateSession } from "@/lib/firebase/queries/sessions";
import type { Session, LocationType, WeatherType, TimeOfDay } from "@/lib/firebase/types";

const LOCATIONS: { value: LocationType; label: string }[] = [
  { value: "street",     label: "Street"     },
  { value: "mall",       label: "Mall"       },
  { value: "cafe",       label: "Cafe"       },
  { value: "park",       label: "Park"       },
  { value: "transit",    label: "Transit"    },
  { value: "market",     label: "Market"     },
  { value: "university", label: "University" },
  { value: "other",      label: "Other"      },
];

const WEATHER_OPTIONS: { value: WeatherType; label: string }[] = [
  { value: "sunny",    label: "Sunny"    },
  { value: "cloudy",   label: "Cloudy"   },
  { value: "overcast", label: "Overcast" },
  { value: "cold",     label: "Cold"     },
  { value: "hot",      label: "Hot"      },
  { value: "rainy",    label: "Rainy"    },
];

const TIME_OPTIONS: { value: TimeOfDay; label: string }[] = [
  { value: "morning",   label: "Morning"   },
  { value: "midday",    label: "Midday"    },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening",   label: "Evening"   },
];

const MOODS = [
  { value: "confident", emoji: "🔥" },
  { value: "neutral",   emoji: "😐" },
  { value: "anxious",   emoji: "😰" },
  { value: "tired",     emoji: "😴" },
  { value: "excited",   emoji: "⚡" },
];

interface EditSessionFormProps {
  session:   Session;
  onSaved:   () => void;
  onCancel:  () => void;
}

export function EditSessionForm({ session, onSaved, onCancel }: EditSessionFormProps) {
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [locationType, setLocationType] = useState<LocationType>(session.locationType);
  const [locationName, setLocationName] = useState(session.locationName ?? "");
  const [weather,      setWeather]      = useState<WeatherType>(session.weather);
  const [timeOfDay,    setTimeOfDay]    = useState<TimeOfDay>(session.timeOfDay);
  const [moodBefore,   setMoodBefore]   = useState(session.moodBefore ?? "neutral");
  const [notes,        setNotes]        = useState(session.notes ?? "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateSession(session.sessionId, {
        locationType,
        locationName,
        weather,
        timeOfDay,
        moodBefore,
        notes,
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const label = "block font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-widest text-[#888888] mb-2";
  const input = "w-full bg-[#111111] border border-[#252525] text-white px-4 py-2.5 focus:outline-none focus:border-[#FF5500] font-[family-name:var(--font-dm-sans)] text-sm";

  return (
    <form onSubmit={handleSave} className="space-y-5">

      <div className="flex items-center justify-between mb-2">
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#FF5500] uppercase tracking-widest">
          EDIT SESSION
        </span>
        <button type="button" onClick={onCancel} className="text-[#444444] hover:text-white font-[family-name:var(--font-jetbrains)] text-xs">
          ✕ CANCEL
        </button>
      </div>

      {error && (
        <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444] text-[#EF4444] text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Location Type</label>
          <select value={locationType} onChange={(e) => setLocationType(e.target.value as LocationType)} className={input}>
            {LOCATIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Location Name</label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="e.g. Oxford Street"
            className={input}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Weather</label>
          <select value={weather} onChange={(e) => setWeather(e.target.value as WeatherType)} className={input}>
            {WEATHER_OPTIONS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Time of Day</label>
          <select value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)} className={input}>
            {TIME_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Mood Before</label>
        <div className="flex gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => setMoodBefore(mood.value)}
              className={`w-10 h-10 border flex items-center justify-center text-xl transition-all ${
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
        <label className={label}>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any notes about this session..."
          className={`${input} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] uppercase tracking-widest py-3 hover:bg-[#E64D00] transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : "SAVE CHANGES"}
      </button>
    </form>
  );
}

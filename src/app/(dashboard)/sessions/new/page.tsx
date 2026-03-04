"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSessions } from "@/hooks/useSessions";
import PageHeader from "@/components/layout/PageHeader";
import type { NewSession } from "@/lib/firebase/types";

const locations = [
  { value: "street",     label: "Street Walk" },
  { value: "mall",       label: "Mall"         },
  { value: "cafe",       label: "Coffee Shop"  },
  { value: "park",       label: "Park"         },
  { value: "market",     label: "Market"       },
  { value: "transit",    label: "Transit"      },
  { value: "university", label: "University"   },
  { value: "other",      label: "Other"        },
];

const times = [
  { value: "morning",   label: "Morning"   },
  { value: "midday",    label: "Midday"    },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening",   label: "Evening"   },
];

const weatherOptions = [
  { value: "sunny",    label: "Sunny"    },
  { value: "cloudy",   label: "Cloudy"   },
  { value: "overcast", label: "Overcast" },
  { value: "cold",     label: "Cold"     },
  { value: "hot",      label: "Hot"      },
  { value: "rainy",    label: "Rainy"    },
];

const moods = [
  { value: "confident", label: "Confident" },
  { value: "neutral",   label: "Neutral"   },
  { value: "nervous",   label: "Nervous"   },
  { value: "motivated", label: "Motivated" },
  { value: "tired",     label: "Tired"     },
];

export default function NewSessionPage() {
  const { userId } = useAuth();
  const { createSession } = useSessions(userId);
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<NewSession>({
    sessionDate:  new Date(),
    locationType: "street",
    locationName: "",
    weather:      "cloudy",
    timeOfDay:    "afternoon",
    moodBefore:   "neutral",
    notes:        "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      const session = await createSession(formData);
      if (session) router.push(`/sessions/${session.sessionId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="NEW SESSION"
        title="Start Session"
        subtitle="Set up your field approach session"
      />

      <div className="h-px bg-[#1A1A1A] my-8" />

      <form onSubmit={handleSubmit} className="max-w-[600px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase text-[#666666] mb-2">
              Location Type
            </label>
            <select
              value={formData.locationType}
              onChange={(e) => setFormData({ ...formData, locationType: e.target.value as any })}
              className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase text-[#666666] mb-2">
              Location Name
            </label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              placeholder="e.g., Capitol Hill, Seattle"
              className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors"
            />
          </div>

          <div>
            <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase text-[#666666] mb-2">
              Time of Day
            </label>
            <select
              value={formData.timeOfDay}
              onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value as any })}
              className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors"
            >
              {times.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase text-[#666666] mb-2">
              Weather
            </label>
            <select
              value={formData.weather}
              onChange={(e) => setFormData({ ...formData, weather: e.target.value as any })}
              className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors"
            >
              {weatherOptions.map((w) => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase text-[#666666] mb-2">
            Mood Before
          </label>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => setFormData({ ...formData, moodBefore: mood.value })}
                className={`px-4 py-2 font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[2px] uppercase border transition-colors ${
                  formData.moodBefore === mood.value
                    ? "border-[#FF5500] text-[#FF5500] bg-[rgba(255,85,0,0.07)]"
                    : "border-[#252525] text-[#666666] hover:border-[#4A4A4A]"
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase text-[#666666] mb-2">
            Notes (optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Any intentions or notes for this session..."
            className="w-full bg-[#111111] border border-[#252525] text-white px-4 py-3 outline-none focus:border-[#4A4A4A] transition-colors resize-none"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-transparent border border-[#333333] text-[#888888] font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase px-7 py-3 hover:border-[#4A4A4A] hover:text-white hover:bg-[#111111] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF5500] text-white font-[family-name:var(--font-jetbrains)] text-[10px] tracking-[3px] uppercase px-7 py-3 hover:bg-[#E64D00] disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating..." : "Start Session"}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  CalendarDays, MapPin, Clock, Plus, Trash2,
  Sparkles, ChevronRight, GripVertical, Sun, Moon, Sunset,
} from 'lucide-react';
import { clsx } from 'clsx';

type PlanItem = {
  id: string;
  time: string;
  name: string;
  category: string;
  duration: string;
  period: 'morning' | 'afternoon' | 'evening';
};

const sampleDay: PlanItem[] = [
  { id: '1', time: '08:00', name: 'Breakfast at Glass House', category: 'Food', duration: '1h', period: 'morning' },
  { id: '2', time: '09:30', name: 'Sanctuary of Truth', category: 'Attraction', duration: '2h', period: 'morning' },
  { id: '3', time: '12:00', name: 'Lunch at Mum Aroi', category: 'Food', duration: '1.5h', period: 'afternoon' },
  { id: '4', time: '14:00', name: 'Koh Larn Island Trip', category: 'Beach', duration: '4h', period: 'afternoon' },
  { id: '5', time: '18:30', name: 'Sunset at Big Buddha Hill', category: 'Viewpoint', duration: '1h', period: 'evening' },
  { id: '6', time: '20:00', name: 'Walking Street', category: 'Nightlife', duration: '3h', period: 'evening' },
];

const periodIcons = { morning: Sun, afternoon: Sunset, evening: Moon };
const periodColors = { morning: 'text-amber-500', afternoon: 'text-orange-500', evening: 'text-indigo-500' };

const suggestedPlaces = [
  { name: 'Terminal 21 Shopping', category: 'Shopping', time: '2h' },
  { name: 'Ramayana Water Park', category: 'Activity', time: '5h' },
  { name: 'Thai Cooking Class', category: 'Experience', time: '3h' },
  { name: 'Nong Nooch Garden', category: 'Attraction', time: '3h' },
];

export function TripPlanner() {
  const [activeDay, setActiveDay] = useState(0);
  const days = ['Day 1 - Apr 15', 'Day 2 - Apr 16', 'Day 3 - Apr 17'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-text">Trip Planner</h1>
          <p className="text-xs text-text-muted">3-day Pattaya adventure</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium">
          <Sparkles size={12} />
          AI Suggest
        </button>
      </div>

      {/* Trip info */}
      <div className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide pb-1">
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-card border border-border text-xs">
          <CalendarDays size={14} className="text-primary" />
          <span className="text-text-secondary">Apr 15 - 17, 2026</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-card border border-border text-xs">
          <MapPin size={14} className="text-primary" />
          <span className="text-text-secondary">Pattaya, Thailand</span>
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 mb-5">
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-medium transition-colors',
              i === activeDay ? 'bg-primary text-white' : 'bg-bg-elevated border border-border text-text-secondary'
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="space-y-0">
            {sampleDay.map((item, idx) => {
              const PeriodIcon = periodIcons[item.period];
              const showPeriodHeader = idx === 0 || sampleDay[idx - 1].period !== item.period;

              return (
                <div key={item.id}>
                  {showPeriodHeader && (
                    <div className="flex items-center gap-2 py-2 mt-2 first:mt-0">
                      <PeriodIcon size={14} className={periodColors[item.period]} />
                      <span className="text-xs font-semibold text-text capitalize">{item.period}</span>
                    </div>
                  )}
                  <div className="flex gap-3 group">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center w-12 flex-shrink-0">
                      <span className="text-[10px] text-text-muted font-medium">{item.time}</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-primary border-2 border-white shadow mt-1" />
                      {idx < sampleDay.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                    </div>
                    {/* Card */}
                    <div className="flex-1 mb-3 p-3 rounded-xl bg-bg-card border border-border group-hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-text">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{item.category}</span>
                            <span className="text-[10px] text-text-muted flex items-center gap-0.5"><Clock size={9} />{item.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 rounded hover:bg-bg-elevated"><GripVertical size={14} className="text-text-muted" /></button>
                          <button className="p-1 rounded hover:bg-danger/10"><Trash2 size={14} className="text-danger" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add activity */}
          <button className="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-sm text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-2">
            <Plus size={16} />
            Add Activity
          </button>
        </div>

        {/* Suggestions sidebar */}
        <div className="mt-6 lg:mt-0">
          <div className="p-4 rounded-xl bg-bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-accent" />
              <h3 className="text-sm font-semibold text-text">Suggested</h3>
            </div>
            <div className="space-y-2">
              {suggestedPlaces.map((place) => (
                <div key={place.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-elevated transition-colors">
                  <div>
                    <p className="text-xs font-medium text-text">{place.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-text-muted">{place.category}</span>
                      <span className="text-[10px] text-text-muted">{place.time}</span>
                    </div>
                  </div>
                  <button className="p-1 rounded-lg hover:bg-primary/10 transition-colors">
                    <Plus size={14} className="text-primary" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

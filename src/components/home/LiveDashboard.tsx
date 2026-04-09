'use client';

import { useTranslations } from 'next-intl';
import {
  Sun, Waves, Wind, Thermometer, Droplets, Sunset,
  ShieldCheck, AlertTriangle,
} from 'lucide-react';
import { clsx } from 'clsx';

type WeatherData = {
  temp: number;
  condition: string;
  humidity: number;
  tideStatus: string;
  tideTime: string;
  aqi: number;
  aqiLabel: string;
  uv: number;
  wind: number;
  seaTemp: number;
  sunset: string;
  swimSafety: 'safe' | 'caution' | 'unsafe';
};

const mockWeather: WeatherData = {
  temp: 32,
  condition: 'Partly Cloudy',
  humidity: 68,
  tideStatus: 'High',
  tideTime: '14:30',
  aqi: 28,
  aqiLabel: 'good',
  uv: 8,
  wind: 12,
  seaTemp: 29,
  sunset: '18:24',
  swimSafety: 'safe',
};

export function LiveDashboard() {
  const t = useTranslations('home');
  const w = mockWeather;

  const swimColor = {
    safe: 'text-success',
    caution: 'text-warning',
    unsafe: 'text-danger',
  };

  const swimLabel = {
    safe: t('safeToSwim'),
    caution: t('caution'),
    unsafe: t('unsafe'),
  };

  const aqiColor = w.aqi <= 50 ? 'text-success' : w.aqi <= 100 ? 'text-warning' : 'text-danger';

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">{t('rightNow')}</h2>
        <div className={clsx('flex items-center gap-1 text-xs font-medium', swimColor[w.swimSafety])}>
          {w.swimSafety === 'safe' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
          {swimLabel[w.swimSafety]}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-px bg-border">
        <DashItem icon={<Sun size={18} className="text-accent" />} label={t('weather')} value={`${w.temp}\u00B0C`} />
        <DashItem icon={<Waves size={18} className="text-info" />} label={t('tide')} value={`${w.tideStatus}`} sub={w.tideTime} />
        <DashItem icon={<Droplets size={18} className={aqiColor} />} label={t('aqi')} value={`${w.aqi}`} sub={t(w.aqiLabel)} />
        <DashItem icon={<Sun size={18} className="text-warning" />} label={t('uv')} value={`${w.uv}`} sub="High" />

        <DashItem icon={<Wind size={18} className="text-text-secondary" />} label={t('wind')} value={`${w.wind}`} sub="km/h" />
        <DashItem icon={<Thermometer size={18} className="text-primary" />} label={t('seaTemp')} value={`${w.seaTemp}\u00B0`} />
        <DashItem icon={<Sunset size={18} className="text-accent" />} label={t('sunset')} value={w.sunset} />
        <DashItem icon={<Droplets size={18} className="text-info" />} label="Humidity" value={`${w.humidity}%`} />
      </div>
    </div>
  );
}

function DashItem({ icon, label, value, sub }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-bg-card flex flex-col items-center justify-center py-3 px-1 gap-1">
      {icon}
      <span className="text-[10px] text-text-muted">{label}</span>
      <span className="text-sm font-bold text-text">{value}</span>
      {sub && <span className="text-[10px] text-text-muted">{sub}</span>}
    </div>
  );
}

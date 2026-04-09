import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft, Sun, Cloud, CloudRain, Wind, Droplets, Eye,
  Thermometer, Waves, Sunrise, Sunset as SunsetIcon, Umbrella,
} from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const hourlyForecast = [
  { time: 'Now', temp: 32, icon: Sun, condition: 'Sunny' },
  { time: '14:00', temp: 33, icon: Sun, condition: 'Sunny' },
  { time: '15:00', temp: 31, icon: Cloud, condition: 'Cloudy' },
  { time: '16:00', temp: 30, icon: Cloud, condition: 'Cloudy' },
  { time: '17:00', temp: 29, icon: CloudRain, condition: 'Rain' },
  { time: '18:00', temp: 28, icon: CloudRain, condition: 'Rain' },
  { time: '19:00', temp: 27, icon: Cloud, condition: 'Cloudy' },
  { time: '20:00', temp: 27, icon: Cloud, condition: 'Clear' },
];

const dailyForecast = [
  { day: 'Today', high: 33, low: 26, icon: Sun, rain: 20 },
  { day: 'Tomorrow', high: 32, low: 25, icon: Cloud, rain: 40 },
  { day: 'Sat', high: 31, low: 25, icon: CloudRain, rain: 70 },
  { day: 'Sun', high: 30, low: 24, icon: CloudRain, rain: 60 },
  { day: 'Mon', high: 32, low: 25, icon: Sun, rain: 10 },
  { day: 'Tue', high: 33, low: 26, icon: Sun, rain: 5 },
  { day: 'Wed', high: 34, low: 26, icon: Sun, rain: 15 },
];

const tideData = [
  { time: '02:30', height: 0.3, type: 'Low' },
  { time: '08:45', height: 1.8, type: 'High' },
  { time: '14:30', height: 0.5, type: 'Low' },
  { time: '20:15', height: 1.6, type: 'High' },
];

export default async function WeatherPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-bold text-text">Weather & Tides</h1>
      </div>

      {/* Current weather hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Pattaya, Thailand</p>
            <p className="text-5xl font-bold mt-1">32°</p>
            <p className="text-sm mt-1">Partly Cloudy</p>
            <p className="text-xs opacity-70 mt-0.5">Feels like 36°</p>
          </div>
          <Sun size={64} className="opacity-90" />
        </div>
        <div className="grid grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/20">
          {[
            { label: 'Humidity', value: '68%', icon: Droplets },
            { label: 'Wind', value: '12 km/h', icon: Wind },
            { label: 'UV Index', value: '8 High', icon: Sun },
            { label: 'Visibility', value: '10 km', icon: Eye },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon size={16} className="mx-auto mb-1 opacity-80" />
              <p className="text-xs font-medium">{value}</p>
              <p className="text-[10px] opacity-60">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-5 lg:space-y-0">
        {/* Hourly */}
        <div className="p-4 rounded-xl bg-bg-card border border-border">
          <h2 className="text-sm font-semibold text-text mb-3">Hourly Forecast</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
            {hourlyForecast.map(({ time, temp, icon: Icon }) => (
              <div key={time} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] text-text-muted">{time}</span>
                <Icon size={18} className="text-accent" />
                <span className="text-xs font-semibold text-text">{temp}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tides */}
        <div className="p-4 rounded-xl bg-bg-card border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Waves size={16} className="text-info" />
            <h2 className="text-sm font-semibold text-text">Tides Today</h2>
          </div>
          <div className="space-y-2">
            {tideData.map((tide) => (
              <div key={tide.time} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-elevated">
                <div className="flex items-center gap-2">
                  <Waves size={14} className={tide.type === 'High' ? 'text-info' : 'text-text-muted'} />
                  <span className="text-xs font-medium text-text">{tide.type} Tide</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-text">{tide.time}</span>
                  <span className="text-[10px] text-text-muted ml-2">{tide.height}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="mt-5 p-4 rounded-xl bg-bg-card border border-border">
        <h2 className="text-sm font-semibold text-text mb-3">7-Day Forecast</h2>
        <div className="space-y-2">
          {dailyForecast.map(({ day, high, low, icon: Icon, rain }) => (
            <div key={day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs font-medium text-text w-20">{day}</span>
              <div className="flex items-center gap-1">
                <Umbrella size={10} className="text-info" />
                <span className="text-[10px] text-info">{rain}%</span>
              </div>
              <Icon size={18} className="text-accent" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text">{high}°</span>
                <span className="text-xs text-text-muted">{low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sun info */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-bg-card border border-border flex items-center gap-3">
          <Sunrise size={24} className="text-accent" />
          <div>
            <p className="text-xs text-text-muted">Sunrise</p>
            <p className="text-sm font-semibold text-text">06:12</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-bg-card border border-border flex items-center gap-3">
          <SunsetIcon size={24} className="text-accent" />
          <div>
            <p className="text-xs text-text-muted">Sunset</p>
            <p className="text-sm font-semibold text-text">18:24</p>
          </div>
        </div>
      </div>
    </div>
  );
}

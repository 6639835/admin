import { Activity } from 'lucide-react';

interface ActivityHeatmapProps {
  activityByHour: number[];
  activityByDay: number[];
}

export default function ActivityHeatmap({ activityByHour, activityByDay }: ActivityHeatmapProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const maxHourActivity = Math.max(...activityByHour, 1);
  const maxDayActivity = Math.max(...activityByDay, 1);

  const getIntensityColor = (value: number, max: number) => {
    const intensity = Math.min((value / max) * 100, 100);
    if (intensity === 0) return 'bg-gray-100 dark:bg-slate-800';
    if (intensity < 20) return 'bg-[var(--c-brand)]/20';
    if (intensity < 40) return 'bg-[var(--c-brand)]/40';
    if (intensity < 60) return 'bg-[var(--c-brand)]/60';
    if (intensity < 80) return 'bg-[var(--c-brand)]/80';
    return 'bg-[var(--c-brand)]';
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--c-brand)]/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-[var(--c-brand)]" />
        </div>
        <h2 className="text-xl font-bold text-primary">
          Comment Activity Patterns
        </h2>
      </div>

      {/* Activity by Hour */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-secondary mb-3">
          Activity by Hour of Day (UTC)
        </h3>
        <div className="grid grid-cols-12 gap-1">
          {hours.map(hour => (
            <div key={hour} className="text-center">
              <div
                className={`h-12 rounded ${getIntensityColor(activityByHour[hour], maxHourActivity)} flex items-center justify-center text-xs font-medium text-primary transition-all hover:opacity-80 hover:scale-105 cursor-pointer`}
                title={`${hour}:00 - ${activityByHour[hour]} comments`}
              >
                {activityByHour[hour] > 0 ? activityByHour[hour] : ''}
              </div>
              <div className="text-xs text-tertiary mt-1">
                {hour}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity by Day */}
      <div>
        <h3 className="text-sm font-semibold text-secondary mb-3">
          Activity by Day of Week
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs font-medium text-secondary mb-1">
                {day}
              </div>
              <div
                className={`h-20 rounded-lg ${getIntensityColor(activityByDay[index], maxDayActivity)} flex items-center justify-center text-sm font-bold text-primary transition-all hover:opacity-80 hover:scale-105 cursor-pointer`}
                title={`${day} - ${activityByDay[index]} comments`}
              >
                {activityByDay[index]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-secondary">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-slate-800"></div>
          <div className="w-4 h-4 rounded bg-[var(--c-brand)]/20"></div>
          <div className="w-4 h-4 rounded bg-[var(--c-brand)]/40"></div>
          <div className="w-4 h-4 rounded bg-[var(--c-brand)]/60"></div>
          <div className="w-4 h-4 rounded bg-[var(--c-brand)]/80"></div>
          <div className="w-4 h-4 rounded bg-[var(--c-brand)]"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}


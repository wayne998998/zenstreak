import { getLast7Days } from '../utils/storage';

const WeeklyView = ({ checkins }) => {
  const last7Days = getLast7Days();

  const today = new Date().toDateString();
  
  return (
    <div className="flex justify-between items-center gap-1">
      {last7Days.map((day, index) => {
        const hasSession = checkins[day.date]?.meditated;
        const isToday = new Date(day.date).toDateString() === today;
        
        return (
          <div key={day.date} className="flex flex-col items-center group">
            <div className="text-zen-xs text-zen-600 mb-2 font-medium transition-colors group-hover:text-zen-700">
              {day.dayName}
            </div>
            <div
              className={`week-day transition-all duration-300 ${
                hasSession
                  ? 'week-day-active'
                  : 'week-day-inactive'
              } ${
                isToday ? 'week-day-today' : ''
              }`}
              style={{animationDelay: `${index * 100}ms`}}
            >
              {hasSession ? (
                <div className="flex flex-col items-center">
                  <span className="text-zen-sm animate-gentle-pulse">✨</span>
                </div>
              ) : (
                <span className="text-zen-sm font-medium">{day.day}</span>
              )}
            </div>
            
            {/* Meditation type indicator */}
            {hasSession && checkins[day.date]?.type && (
              <div className="mt-1 text-zen-xs opacity-75">
                {checkins[day.date].type === 'mindfulness' && '🧘'}
                {checkins[day.date].type === 'breathing' && '🌬️'}
                {checkins[day.date].type === 'loving-kindness' && '❤️'}
                {checkins[day.date].type === 'body-scan' && '💫'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyView;
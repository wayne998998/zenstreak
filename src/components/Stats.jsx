const Stats = ({ streakData }) => {
  const stats = [
    {
      label: 'Total Sessions',
      value: streakData.totalSessions,
      emoji: '🧘‍♀️',
      color: 'mint',
      description: 'Moments of peace'
    },
    {
      label: 'Longest Streak',
      value: streakData.longestStreak,
      emoji: '🌱',
      color: 'sage',
      description: 'Days of growth'
    },
    {
      label: 'This Month',
      value: Object.keys(streakData.checkins).filter(date => {
        const checkDate = new Date(date);
        const now = new Date();
        return checkDate.getMonth() === now.getMonth() && 
               checkDate.getFullYear() === now.getFullYear() &&
               streakData.checkins[date]?.meditated;
      }).length,
      emoji: '🌿',
      color: 'lime',
      description: 'This month\'s journey'
    }
  ];

  return (
    <div className="zen-card p-zen-xl">
      <div className="text-center mb-zen-lg">
        <div className="inline-flex items-center justify-center space-x-2 mb-zen-sm">
          <span className="w-2 h-2 bg-mint-400 rounded-full animate-gentle-pulse"></span>
          <h3 className="text-zen-xl font-display font-semibold text-sage-800">
            Your Mindful Progress
          </h3>
          <span className="w-2 h-2 bg-lime-400 rounded-full animate-gentle-pulse" style={{animationDelay: '0.5s'}}></span>
        </div>
        <p className="text-sage-600 text-zen-sm">
          Every session strengthens your inner peace
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-zen-md">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card text-center group animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 mb-zen-sm group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-lg animate-gentle-pulse">{stat.emoji}</span>
            </div>
            <div className={`text-zen-2xl font-display font-bold text-zen-800 mb-1 group-hover:text-${stat.color}-600 transition-colors`}>
              {stat.value}
            </div>
            <div className="text-zen-xs text-zen-600 font-medium mb-1">{stat.label}</div>
            <div className="text-zen-xs text-zen-500 italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-zen-lg pt-zen-lg border-t border-zen-200/50 text-center">
        <p className="text-zen-xs text-zen-500 italic">
          “The mind is everything. What you think you become.” — Buddha
        </p>
      </div>
    </div>
  );
};

export default Stats;
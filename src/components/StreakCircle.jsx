import { useState } from 'react';

const StreakCircle = ({ streak, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  // Enhanced mint-inspired colors with peaceful meditation tones
  const getStreakColor = (days) => {
    if (days === 0) return 'bg-gradient-to-br from-cloud-300 to-cloud-400';
    if (days < 7) return 'bg-gradient-to-br from-sage-400 via-lime-400 to-sage-500';
    if (days < 30) return 'bg-gradient-to-br from-sage-400 via-sage-500 to-mint-500';
    if (days < 100) return 'bg-gradient-to-br from-mint-400 via-sage-500 to-lime-400';
    return 'bg-gradient-to-br from-lime-400 via-mint-500 to-sage-500';
  };

  const getStreakEmoji = (days) => {
    if (days === 0) return '🧘';
    if (days < 7) return '🌱';
    if (days < 30) return '🌿';
    if (days < 100) return '🌳';
    return '🏆';
  };

  const getStreakMessage = (days) => {
    if (days === 0) return 'Begin your journey';
    if (days === 1) return 'First step taken';
    if (days < 7) return 'Building momentum';
    if (days === 7) return 'One week of mindfulness!';
    if (days < 30) return 'Growing stronger';
    if (days === 30) return 'One month of peace!';
    if (days < 100) return 'Deeply rooted practice';
    if (days === 100) return '100 days of inner growth!';
    return 'Zen master level achieved';
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Enhanced multi-layer glow rings for active streaks */}
      {streak > 0 && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-mint-200/15 to-sage-200/15 animate-breathe-slow" 
               style={{ width: '180px', height: '180px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-mint-300/20 to-sage-300/20 animate-gentle-pulse" 
               style={{ width: '160px', height: '160px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          </div>
        </>
      )}
      
      {/* Milestone celebration rings */}
      {streak >= 7 && (
        <div className="absolute inset-0 rounded-full border-2 border-mint-400/30 animate-meditation-glow" 
             style={{ width: '170px', height: '170px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        </div>
      )}
      
      <div 
        className={`streak-circle ${getStreakColor(streak)} relative z-10 cursor-pointer transition-all duration-300 ${
          isPressed ? 'scale-95' : 'hover:scale-105'
        } ${showRipple ? 'animate-ripple-effect' : ''}`}
        onClick={() => {
          if (onClick) {
            setShowRipple(true);
            onClick(streak);
            setTimeout(() => setShowRipple(false), 600);
          }
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        title={`Click to celebrate your ${streak} day streak!`}
      >
        <div className="text-center relative z-20">
          <div className={`text-5xl mb-2 filter drop-shadow-lg transition-transform duration-300 ${
            isPressed ? 'scale-90' : 'animate-gentle-pulse'
          }`}>
            {getStreakEmoji(streak)}
          </div>
          <div className="text-zen-4xl font-display font-bold tracking-tight">
            {streak}
          </div>
          {streak > 0 && (
            <div className="text-zen-xs font-medium opacity-90 mt-1 tracking-wide uppercase">
              {streak === 1 ? 'Day' : 'Days'}
            </div>
          )}
          
          {/* Ripple effect overlay */}
          {showRipple && (
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ripple pointer-events-none"></div>
          )}
        </div>
      </div>
      
      {/* Enhanced progress message with milestone indicators */}
      <div className="mt-zen-md text-center">
        <p className="text-sage-600 text-zen-sm font-medium mb-1">
          {getStreakMessage(streak)}
        </p>
        {streak > 0 && (
          <div className="flex items-center justify-center space-x-1 text-mint-500 text-zen-xs">
            {streak >= 7 && <span className="w-2 h-2 bg-mint-400 rounded-full animate-gentle-pulse"></span>}
            {streak >= 30 && <span className="w-2 h-2 bg-sage-400 rounded-full animate-gentle-pulse" style={{animationDelay: '0.5s'}}></span>}
            {streak >= 100 && <span className="w-2 h-2 bg-lime-400 rounded-full animate-gentle-pulse" style={{animationDelay: '1s'}}></span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCircle;
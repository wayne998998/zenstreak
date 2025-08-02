import { useState, useEffect } from 'react';

const BreathingAnimation = ({ isPlaying }) => {
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
  const [cycleProgress, setCycleProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    // Breathing pattern: 4 seconds inhale, 2 seconds hold, 6 seconds exhale
    const breathingPattern = {
      inhale: 4000,
      hold: 2000,
      exhale: 6000
    };

    const totalCycle = breathingPattern.inhale + breathingPattern.hold + breathingPattern.exhale;
    let startTime = Date.now();

    const updateBreathing = () => {
      if (!isPlaying) return;

      const elapsed = (Date.now() - startTime) % totalCycle;
      const progress = elapsed / totalCycle;
      setCycleProgress(progress);

      if (elapsed < breathingPattern.inhale) {
        setBreathPhase('inhale');
      } else if (elapsed < breathingPattern.inhale + breathingPattern.hold) {
        setBreathPhase('hold');
      } else {
        setBreathPhase('exhale');
      }
    };

    const interval = setInterval(updateBreathing, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getScale = () => {
    if (!isPlaying) return 1;
    
    // Calculate exact phase progress
    const totalCycle = 12000; // 4s + 2s + 6s
    const elapsed = (Date.now() % totalCycle) / totalCycle;
    
    if (elapsed < 4/12) {
      // Inhale phase (4 seconds) - dramatic scale up with easing
      const progress = (elapsed * 12) / 4;
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      return 1 + (easedProgress * 0.8); // Scale up to 1.8 (much larger)
    } else if (elapsed < 6/12) {
      // Hold phase (2 seconds) - stay at max with gentle pulse
      const holdProgress = ((elapsed * 12) - 4) / 2;
      return 1.8 + Math.sin(holdProgress * Math.PI * 6) * 0.05; // Gentle breathing pulse
    } else {
      // Exhale phase (6 seconds) - smooth scale down with easing
      const progress = ((elapsed * 12) - 6) / 6;
      const easedProgress = Math.pow(progress, 2); // Ease-in quadratic
      return 1.8 - (easedProgress * 0.8); // Scale down to 1
    }
  };

  const getInstructionText = () => {
    if (!isPlaying) return 'Press play to begin';
    
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe in...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe out...';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-zen-lg">
      {/* Main Breathing Circle */}
      <div className="relative">
        {/* Enhanced outer glow rings with dramatic expansion */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(20, 184, 166, ${breathPhase === 'inhale' ? 0.4 : 0.2}) 0%, transparent 70%)`,
            transform: `scale(${getScale() * 1.4})`,
            transition: breathPhase === 'inhale' ? 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'all 0.4s ease-out',
            opacity: breathPhase === 'inhale' ? 0.6 : 0.3
          }}
        />
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(34, 197, 94, ${breathPhase === 'inhale' ? 0.3 : 0.15}) 0%, transparent 60%)`,
            transform: `scale(${getScale() * 1.2})`,
            transition: breathPhase === 'inhale' ? 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'all 0.4s ease-out',
            opacity: breathPhase === 'inhale' ? 0.5 : 0.25
          }}
        />
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(132, 204, 22, ${breathPhase === 'inhale' ? 0.25 : 0.1}) 0%, transparent 50%)`,
            transform: `scale(${getScale() * 1.6})`,
            transition: breathPhase === 'inhale' ? 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'all 0.4s ease-out',
            opacity: breathPhase === 'inhale' ? 0.4 : 0.15
          }}
        />
        
        {/* Main circle with enhanced growing animation */}
        <div 
          className="w-32 h-32 rounded-full bg-gradient-to-br from-mint-400 via-sage-400 to-lime-400 flex items-center justify-center shadow-2xl relative overflow-hidden"
          style={{
            transform: `scale(${getScale()})`,
            transition: breathPhase === 'inhale' ? 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 
                       breathPhase === 'exhale' ? 'transform 0.4s cubic-bezier(0.55, 0.06, 0.68, 0.19)' : 
                       'transform 0.1s ease-out',
            filter: `brightness(${breathPhase === 'inhale' ? 1.3 : breathPhase === 'hold' ? 1.4 : 0.9}) 
                     saturate(${breathPhase === 'inhale' ? 1.2 : breathPhase === 'hold' ? 1.3 : 1})
                     blur(${breathPhase === 'exhale' ? '0.5px' : '0px'})`,
            boxShadow: `
              0 ${getScale() * 16}px ${getScale() * 64}px -4px rgba(20, 184, 166, ${breathPhase === 'inhale' ? 0.7 : breathPhase === 'hold' ? 0.8 : 0.3}),
              0 ${getScale() * 8}px ${getScale() * 32}px -2px rgba(20, 184, 166, ${breathPhase === 'inhale' ? 0.5 : 0.3}),
              0 0 ${getScale() * 20}px rgba(20, 184, 166, ${breathPhase === 'inhale' ? 0.6 : breathPhase === 'hold' ? 0.7 : 0.2}),
              inset 0 2px 4px rgba(255, 255, 255, 0.4),
              inset 0 -2px 4px rgba(0, 0, 0, 0.1)
            `
          }}
        >
          {/* Inner gradient overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-white/10 to-black/10" />
          
          {/* Animated center symbol */}
          <div 
            className="relative z-10 text-5xl text-white transition-all duration-500"
            style={{
              transform: `scale(${breathPhase === 'inhale' ? 1.1 : breathPhase === 'hold' ? 1.2 : 0.9})`,
              filter: `drop-shadow(0 0 ${breathPhase === 'hold' ? '8px' : '4px'} rgba(255,255,255,0.6))`
            }}
          >
            {breathPhase === 'inhale' ? '🌱' : breathPhase === 'hold' ? '🧘‍♀️' : '🍃'}
          </div>
          
          {/* Enhanced breathing particles with dramatic inhale effect */}
          {isPlaying && Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: breathPhase === 'inhale' ? '8px' : breathPhase === 'hold' ? '6px' : '3px',
                height: breathPhase === 'inhale' ? '8px' : breathPhase === 'hold' ? '6px' : '3px',
                background: `radial-gradient(circle, rgba(255,255,255,${breathPhase === 'inhale' ? 0.8 : breathPhase === 'hold' ? 0.9 : 0.4}) 0%, transparent 100%)`,
                top: '50%',
                left: '50%',
                transform: `
                  translate(-50%, -50%) 
                  rotate(${i * 30}deg) 
                  translateY(${breathPhase === 'inhale' ? -60 * getScale() : breathPhase === 'exhale' ? -20 : -45}px)
                  scale(${breathPhase === 'inhale' ? 1.5 : breathPhase === 'hold' ? 1.3 : 0.8})
                `,
                opacity: breathPhase === 'inhale' ? 0.9 : breathPhase === 'hold' ? 1 : 0.4,
                transition: breathPhase === 'inhale' ? 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'all 0.6s ease-out',
                animationDelay: `${i * 0.05}s`,
                filter: `blur(${breathPhase === 'exhale' ? '1.5px' : '0px'}) brightness(${breathPhase === 'inhale' ? 1.3 : 1})`
              }}
            />
          ))}
        </div>

        {/* Progress ring */}
        <svg 
          className="absolute inset-0 w-full h-full -rotate-90" 
          viewBox="0 0 128 128"
        >
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="none"
            stroke="rgba(20, 184, 166, 0.1)"
            strokeWidth="2"
          />
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="none"
            stroke="rgba(20, 184, 166, 0.6)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 60}`}
            strokeDashoffset={`${2 * Math.PI * 60 * (1 - cycleProgress)}`}
            style={{
              transition: 'stroke-dashoffset 0.3s ease-out'
            }}
          />
        </svg>
      </div>

      {/* Enhanced instruction text */}
      <div className="text-center">
        <p 
          className="text-zen-xl font-semibold text-sage-800 mb-zen-sm transition-all duration-500"
          style={{
            transform: `scale(${breathPhase === 'hold' ? 1.05 : 1})`,
            color: breathPhase === 'inhale' ? '#0d9488' : breathPhase === 'hold' ? '#059669' : '#10b981'
          }}
        >
          {getInstructionText()}
        </p>
        {isPlaying && (
          <div className="flex items-center justify-center space-x-3 text-zen-sm text-sage-600">
            <div 
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: breathPhase === 'inhale' ? '#14b8a6' : breathPhase === 'hold' ? '#059669' : '#10b981',
                transform: `scale(${breathPhase === 'hold' ? 1.5 : 1})`,
                opacity: breathPhase === 'hold' ? 1 : 0.7
              }}
            ></div>
            <span className="font-medium">Follow the rhythm</span>
            <div 
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: breathPhase === 'inhale' ? '#14b8a6' : breathPhase === 'hold' ? '#059669' : '#10b981',
                transform: `scale(${breathPhase === 'hold' ? 1.5 : 1})`,
                opacity: breathPhase === 'hold' ? 1 : 0.7,
                animationDelay: '0.5s'
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Breathing Count Indicator */}
      {isPlaying && (
        <div className="flex items-center space-x-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i < Math.floor(cycleProgress * 8) 
                  ? 'bg-mint-400 scale-125' 
                  : 'bg-sage-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BreathingAnimation;
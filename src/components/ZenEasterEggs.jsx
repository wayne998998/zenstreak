import { useState, useEffect } from 'react';

const ZenEasterEggs = ({ streakData }) => {
  const [activeEgg, setActiveEgg] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [breathingCoachVisible, setBreathingCoachVisible] = useState(false);

  // Easter egg triggers
  const easterEggs = [
    {
      id: 'breathing-coach',
      trigger: 'logo-clicks',
      threshold: 7,
      component: BreathingCoach,
      duration: 30000, // 30 seconds
      message: "You found the hidden breathing coach! 🧘‍♂️"
    },
    {
      id: 'meditation-master',
      trigger: 'streak-milestone',
      threshold: 108, // Sacred number in many meditation traditions
      component: MeditationMasterSurprise,
      duration: 10000,
      message: "108 days! You've unlocked the sacred meditation number! 🕉️"
    },
    {
      id: 'zen-garden',
      trigger: 'perfect-week',
      component: ZenGardenSurprise,
      duration: 15000,
      message: "A perfect week of meditation! Watch your zen garden bloom 🌸"
    },
    {
      id: 'mindful-rain',
      trigger: 'long-session',
      component: MindfulRain,
      duration: 20000,
      message: "Long meditation sessions bring peaceful rain ☔"
    }
  ];

  // Check for logo click easter egg
  useEffect(() => {
    const handleLogoClick = () => {
      const now = Date.now();
      if (now - lastClickTime < 1000) { // Rapid clicks within 1 second
        setClickCount(prev => prev + 1);
      } else {
        setClickCount(1);
      }
      setLastClickTime(now);

      if (clickCount >= 6) {
        triggerEasterEgg('breathing-coach');
        setClickCount(0);
      }
    };

    // Add click listener to logo/title
    const logoElement = document.querySelector('h1');
    if (logoElement) {
      logoElement.addEventListener('click', handleLogoClick);
      logoElement.style.cursor = 'pointer';
      return () => logoElement.removeEventListener('click', handleLogoClick);
    }
  }, [clickCount, lastClickTime]);

  // Check for streak milestones
  useEffect(() => {
    if (streakData?.currentStreak === 108) {
      triggerEasterEgg('meditation-master');
    }
  }, [streakData?.currentStreak]);

  // Check for perfect week
  useEffect(() => {
    if (streakData?.checkins) {
      const last7Days = getLast7Days();
      const perfectWeek = last7Days.every(day => 
        streakData.checkins[day.date]?.meditated
      );
      
      if (perfectWeek && streakData.currentStreak >= 7) {
        const lastTriggered = localStorage.getItem('zen-garden-last-triggered');
        const today = new Date().toDateString();
        
        if (lastTriggered !== today) {
          triggerEasterEgg('zen-garden');
          localStorage.setItem('zen-garden-last-triggered', today);
        }
      }
    }
  }, [streakData?.checkins]);

  const triggerEasterEgg = (eggId) => {
    const egg = easterEggs.find(e => e.id === eggId);
    if (!egg || activeEgg) return;

    setActiveEgg(egg);
    
    // Auto-close after duration
    setTimeout(() => {
      setActiveEgg(null);
    }, egg.duration);
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString('en-CA')
      });
    }
    return days;
  };

  if (!activeEgg) return null;

  const EggComponent = activeEgg.component;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <EggComponent 
        onClose={() => setActiveEgg(null)}
        message={activeEgg.message}
      />
    </div>
  );
};

// Breathing Coach Easter Egg
const BreathingCoach = ({ onClose, message }) => {
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, pause
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const phases = [
      { name: 'inhale', duration: 4000, next: 'hold', instruction: 'Breathe in...' },
      { name: 'hold', duration: 4000, next: 'exhale', instruction: 'Hold...' },
      { name: 'exhale', duration: 6000, next: 'pause', instruction: 'Breathe out...' },
      { name: 'pause', duration: 2000, next: 'inhale', instruction: 'Rest...' }
    ];

    const currentPhase = phases.find(p => p.name === phase);
    const timer = setTimeout(() => {
      setPhase(currentPhase.next);
      if (currentPhase.next === 'inhale') {
        setCycle(prev => prev + 1);
      }
    }, currentPhase.duration);

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="zen-card p-zen-2xl text-center max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-zen-md right-zen-md text-zen-400 hover:text-zen-600 text-xl"
        >
          ×
        </button>
        
        <div className="mb-zen-lg">
          <p className="text-zen-sm text-zen-600 mb-zen-md">{message}</p>
          <h3 className="text-zen-xl font-display font-semibold text-zen-800 mb-zen-md">
            Breathing Exercise
          </h3>
        </div>

        {/* Breathing Circle */}
        <div className="mb-zen-lg">
          <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-zen-400 to-serenity-500 flex items-center justify-center transition-all duration-1000 ${
            phase === 'inhale' ? 'scale-125' : 
            phase === 'hold' ? 'scale-125' : 
            phase === 'exhale' ? 'scale-75' : 'scale-75'
          }`}>
            <span className="text-white font-display font-bold text-zen-lg">
              {phase === 'inhale' ? '🫁' : phase === 'hold' ? '⏸️' : phase === 'exhale' ? '🌬️' : '💤'}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-zen-lg">
          <p className="text-zen-lg font-medium text-zen-700 capitalize mb-zen-sm">
            {phase === 'inhale' ? 'Breathe In' : 
             phase === 'hold' ? 'Hold' : 
             phase === 'exhale' ? 'Breathe Out' : 'Rest'}
          </p>
          <p className="text-zen-sm text-zen-500">
            Cycle {cycle + 1} • Follow the circle
          </p>
        </div>

        <div className="text-zen-xs text-zen-400 italic">
          Click anywhere to close
        </div>
      </div>
    </div>
  );
};

// Meditation Master Surprise (108 days)
const MeditationMasterSurprise = ({ onClose, message }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-gradient-to-br from-purple-900/20 to-gold-900/20 backdrop-blur-sm animate-fade-in">
      <div className="zen-card p-zen-2xl text-center max-w-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-100/30 to-purple-100/30 animate-breathe"></div>
        
        <div className="relative z-10">
          <div className="mb-zen-lg">
            <div className="text-6xl mb-zen-md animate-gentle-pulse">🕉️</div>
            <h3 className="text-zen-2xl font-display font-bold text-zen-800 mb-zen-sm">
              Sacred Milestone
            </h3>
            <p className="text-zen-sm text-zen-600 mb-zen-md">{message}</p>
          </div>

          <div className="mb-zen-lg">
            <p className="text-zen-base text-zen-700 leading-relaxed mb-zen-md">
              In many meditation traditions, 108 is considered the most sacred number. 
              You have achieved something truly special.
            </p>
            <div className="flex items-center justify-center space-x-2 text-zen-500 text-zen-sm">
              <span>🙏</span>
              <span>Namaste, Meditation Master</span>
              <span>🙏</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="zen-button"
          >
            Continue the Journey
          </button>
        </div>
      </div>
    </div>
  );
};

// Zen Garden Surprise (Perfect Week)
const ZenGardenSurprise = ({ onClose, message }) => {
  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    // Create flowering animation
    const flowerPositions = [
      { x: 20, y: 30, delay: 0 },
      { x: 60, y: 25, delay: 500 },
      { x: 40, y: 60, delay: 1000 },
      { x: 80, y: 55, delay: 1500 },
      { x: 15, y: 70, delay: 2000 },
      { x: 75, y: 40, delay: 2500 },
    ];

    flowerPositions.forEach((pos, index) => {
      setTimeout(() => {
        setFlowers(prev => [...prev, { ...pos, id: index, emoji: ['🌸', '🌺', '🌻', '🌼', '🌷'][index % 5] }]);
      }, pos.delay);
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-green-900/20 backdrop-blur-sm animate-fade-in">
      <div className="zen-card p-zen-2xl text-center max-w-md relative overflow-hidden h-64">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/40 to-pink-100/40"></div>
        
        {/* Animated Flowers */}
        {flowers.map(flower => (
          <div
            key={flower.id}
            className="absolute text-2xl animate-zen-bloom"
            style={{
              left: `${flower.x}%`,
              top: `${flower.y}%`,
            }}
          >
            {flower.emoji}
          </div>
        ))}
        
        <div className="relative z-10">
          <div className="mb-zen-md">
            <h3 className="text-zen-xl font-display font-semibold text-zen-800 mb-zen-sm">
              Perfect Week Achieved!
            </h3>
            <p className="text-zen-sm text-zen-600">{message}</p>
          </div>

          <button
            onClick={onClose}
            className="zen-button-secondary mt-zen-lg"
          >
            Beautiful! ✨
          </button>
        </div>
      </div>
    </div>
  );
};

// Mindful Rain Effect
const MindfulRain = ({ onClose, message }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-blue-900/10">
        {/* Rain drops */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-12 bg-gradient-to-b from-blue-400/60 to-transparent animate-zen-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ZenEasterEggs;
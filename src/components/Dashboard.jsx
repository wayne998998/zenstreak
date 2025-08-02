import { useState, useEffect } from 'react';
import { loadStreakData, hasCheckedInToday, saveCheckIn } from '../utils/storage';
import StreakCircle from './StreakCircle';
import WeeklyView from './WeeklyView';
import CheckInButton from './CheckInButton';
import Stats from './Stats';
import Settings from './Settings';
import MilestoneCelebration from './MilestoneCelebration';
import DailyWisdom from './DailyWisdom';
import ZenEasterEggs from './ZenEasterEggs';
import SocialShare from './SocialShare';
import GuidedMeditations from './GuidedMeditations';

const Dashboard = ({ onToast }) => {
  const [streakData, setStreakData] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMilestone, setShowMilestone] = useState(null);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [showGuidedMeditations, setShowGuidedMeditations] = useState(false);
  // const [celebrationQueue, setCelebrationQueue] = useState([]);
  const [lastStreakCelebrated, setLastStreakCelebrated] = useState(null);

  useEffect(() => {
    const data = loadStreakData();
    setStreakData(data);
    setHasCheckedIn(hasCheckedInToday(data));
    
    // Check for missed milestone celebrations on load
    const lastCelebrated = localStorage.getItem('lastMilestoneCelebrated');
    setLastStreakCelebrated(lastCelebrated ? parseInt(lastCelebrated) : null);
  }, []);

  const handleCheckInSuccess = (newData) => {
    const oldStreak = streakData?.currentStreak || 0;
    const newStreak = newData.currentStreak;
    
    setStreakData(newData);
    setHasCheckedIn(true);
    
    // Check for milestone celebrations
    if (newStreak > oldStreak) {
      checkForMilestone(newStreak);
    }
    
    // Add subtle celebration for any successful check-in
    if (newStreak > 0) {
      triggerSuccessCelebration();
    }
  };
  
  const checkForMilestone = (streak) => {
    const milestones = [7, 14, 21, 30, 50, 100, 365];
    const achievedMilestone = milestones.find(m => m === streak);
    
    if (achievedMilestone && achievedMilestone !== lastStreakCelebrated) {
      setShowMilestone(streak);
      setLastStreakCelebrated(achievedMilestone);
      // Store in localStorage to prevent repeated celebrations
      localStorage.setItem('lastMilestoneCelebrated', achievedMilestone.toString());
    }
  };
  
  const triggerSuccessCelebration = () => {
    // Add a subtle animation to the check-in area
    const checkinArea = document.querySelector('.check-in-success');
    if (checkinArea) {
      checkinArea.classList.add('animate-success-shake');
      setTimeout(() => {
        checkinArea.classList.remove('animate-success-shake');
      }, 500);
    }
  };
  
  const triggerStreakCelebration = (streak) => {
    // Show toast notification
    const messages = {
      1: "Your first day of mindfulness! 🌱",
      7: "One week of meditation magic! 🌟",
      30: "30 days of inner peace achieved! 🧘‍♀️",
      100: "100 days! You're a meditation master! 🏆",
      365: "A full year of daily practice! Incredible! 🎊"
    };
    
    const message = messages[streak] || `${streak} days of beautiful practice! ✨`;
    onToast?.(message, { 
      type: 'celebration', 
      emoji: streak >= 100 ? '🏆' : streak >= 30 ? '🧘‍♀️' : '🌟',
      duration: 4000 
    });
    
    // Create small celebration particles around the streak circle
    const celebrationEmojis = streak >= 100 ? ['🏆', '✨', '🎆'] : 
                             streak >= 30 ? ['🌱', '🌿', '✨'] : 
                             ['🧘‍♀️', '🌟', '✨'];
    
    const container = document.body;
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
      particle.className = 'fixed pointer-events-none text-xl animate-zen-particles z-40';
      
      // Position around the streak circle
      const rect = document.querySelector('.streak-circle')?.getBoundingClientRect();
      if (rect) {
        particle.style.left = (rect.left + rect.width/2 + (Math.random() - 0.5) * 200) + 'px';
        particle.style.top = (rect.top + rect.height/2 + (Math.random() - 0.5) * 200) + 'px';
        particle.style.animationDelay = Math.random() * 0.5 + 's';
      }
      
      container.appendChild(particle);
      
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, 4000);
    }
  };

  const handleMeditationComplete = () => {
    // Check in user when they complete a meditation
    const newData = saveCheckIn();
    handleCheckInSuccess(newData);
    
    // Show celebration message
    onToast?.('Meditation completed! 🧘‍♀️ Your daily check-in is complete.', {
      type: 'success',
      emoji: '🌟',
      duration: 4000
    });
    
    setShowGuidedMeditations(false);
  };

  const handleDataReset = () => {
    const data = loadStreakData();
    setStreakData(data);
    setHasCheckedIn(hasCheckedInToday(data));
    setShowSettings(false);
  };

  if (!streakData) return null;

  return (
    <div className="max-w-md mx-auto p-4 space-y-zen-lg">
      {/* Enhanced Header with meditation focus */}
      <div className="text-center relative py-zen-xl">
        <div className="absolute right-0 top-zen-lg flex space-x-2">
          <button
            onClick={() => setShowSocialShare(true)}
            className="p-zen-md text-sage-500 hover:text-sage-700 transition-all duration-300 hover:scale-110 rounded-zen hover:bg-sage-50 group"
            title="Share your journey"
          >
            <span className="text-xl group-hover:animate-bounce">📱</span>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-zen-md text-sage-500 hover:text-sage-700 transition-all duration-300 hover:scale-110 rounded-zen hover:bg-sage-50"
          >
            <span className="text-xl">⚙️</span>
          </button>
        </div>
        <div className="zen-glow inline-block mb-zen-md">
          <h1 className="text-zen-4xl font-display font-bold text-sage-800 mb-zen-xs tracking-tight">
            ZenStreak
          </h1>
          <div className="h-1 w-16 bg-gradient-to-r from-mint-400 via-sage-400 to-lime-400 rounded-full mx-auto animate-gentle-pulse"></div>
        </div>
        <p className="text-sage-600 text-zen-lg font-medium mb-zen-sm">Your meditation journey</p>
        <div className="flex items-center justify-center space-x-3 text-mint-500 text-zen-sm">
          <span className="w-6 h-0.5 bg-gradient-to-r from-transparent via-mint-300 to-transparent rounded-full animate-zen-float"></span>
          <span className="animate-gentle-pulse">🧘‍♀️</span>
          <span className="text-zen-xs font-medium">Mindful • Present • Peaceful</span>
          <span className="animate-gentle-pulse" style={{animationDelay: '1s'}}>🧘‍♂️</span>
          <span className="w-6 h-0.5 bg-gradient-to-r from-transparent via-sage-300 to-transparent rounded-full animate-zen-float" style={{animationDelay: '2s'}}></span>
        </div>
      </div>

      {/* Enhanced Main Streak Display */}
      <div className="zen-card-elevated p-zen-2xl text-center relative">
        <div className="breathing-indicator"></div>
        <StreakCircle 
          streak={streakData.currentStreak} 
          onClick={(streak) => {
            // Fun interaction - show celebration for existing streaks
            if (streak > 0) {
              triggerStreakCelebration(streak);
            }
          }}
        />
        <div className="mt-zen-lg relative z-10">
          <h2 className="text-zen-2xl font-display font-semibold text-sage-800 mb-zen-sm">
            Current Streak
          </h2>
          <p className="text-sage-600 text-zen-base font-medium">
            {streakData.currentStreak === 0 
              ? "✨ Start your journey today!" 
              : `${streakData.currentStreak} day${streakData.currentStreak === 1 ? '' : 's'} of mindfulness`
            }
          </p>
          {streakData.currentStreak > 0 && (
            <div className="mt-zen-md flex items-center justify-center space-x-1 text-mint-500 text-zen-sm">
              <span>Keep the momentum flowing</span>
              <span className="animate-gentle-pulse">✨</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Check-in Section with guided meditations */}
      {!hasCheckedIn ? (
        <div className="zen-card p-zen-xl animate-fade-in-up">
          <div className="text-center mb-zen-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-mint-100 via-sage-50 to-lime-100 mb-zen-md shadow-mint animate-breathe">
              <span className="text-3xl animate-gentle-pulse">🧘‍♀️</span>
            </div>
            <h3 className="text-zen-xl font-display font-semibold text-sage-800 mb-zen-sm">
              Did you meditate today?
            </h3>
            <p className="text-sage-600 text-zen-base leading-relaxed mb-zen-md">
              Take a mindful moment to check in and nurture your inner peace
            </p>
            
            {/* Guided Meditations Button */}
            <button
              onClick={() => setShowGuidedMeditations(true)}
              className="zen-button-secondary mb-zen-md group w-full"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl group-hover:animate-pulse">🎧</span>
                <span>Guided Meditations</span>
                <span className="text-zen-xs text-mint-500">(Auto check-in)</span>
              </div>
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sage-200"></div>
              </div>
              <div className="relative flex justify-center text-zen-xs">
                <span className="bg-white px-2 text-sage-500">or</span>
              </div>
            </div>
            
            <div className="mt-zen-md flex items-center justify-center space-x-2 text-mint-400 text-zen-xs">
              <span className="w-4 h-0.5 bg-mint-300 rounded-full animate-zen-float"></span>
              <span>Every moment counts</span>
              <span className="w-4 h-0.5 bg-sage-300 rounded-full animate-zen-float" style={{animationDelay: '1s'}}></span>
            </div>
          </div>
          <CheckInButton onSuccess={handleCheckInSuccess} />
        </div>
      ) : (
        <div className="zen-card p-zen-xl text-center animate-fade-in-up check-in-success">
          <div className="success-checkmark mb-zen-md">✨</div>
          <h3 className="text-zen-xl font-display font-semibold text-mint-800 mb-zen-sm">
            Beautiful work!
          </h3>
          <p className="text-sage-600 text-zen-base mb-zen-lg leading-relaxed">
            You've honored your practice today. Your inner light grows stronger.
          </p>
          <div className="flex items-center justify-center space-x-3 text-mint-500 text-zen-sm mb-zen-md">
            <span className="animate-gentle-pulse">🌱</span>
            <span className="font-medium">Growth through presence</span>
            <span className="animate-gentle-pulse" style={{animationDelay: '1s'}}>🌱</span>
          </div>
          
          {/* Share Achievement Button */}
          <button
            onClick={() => setShowSocialShare(true)}
            className="zen-button-secondary mb-zen-md group shareable-hover"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>Share Today's Achievement</span>
              <span className="group-hover:animate-bounce">🌟</span>
            </div>
          </button>
          
          <div className="text-zen-xs text-mint-400 italic mb-zen-md">
            "The present moment is the only time over which we have dominion." — Thích Nhất Hạnh
          </div>
          
          {/* Guided Meditations for checked-in users */}
          <button
            onClick={() => setShowGuidedMeditations(true)}
            className="zen-button-secondary group w-full"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg group-hover:animate-pulse">🎧</span>
              <span>Continue with Guided Meditations</span>
            </div>
          </button>
        </div>
      )}

      {/* Daily Wisdom Quote */}
      <DailyWisdom onShare={() => setShowSocialShare(true)} />
      
      {/* Guided Meditations Section */}
      <div className="zen-card p-zen-xl">
        <div className="text-center mb-zen-lg">
          <div className="inline-flex items-center justify-center space-x-2 mb-zen-sm">
            <span className="w-2 h-2 bg-mint-400 rounded-full animate-gentle-pulse"></span>
            <h3 className="text-zen-xl font-display font-semibold text-sage-800">
              Guided Meditations
            </h3>
            <span className="w-2 h-2 bg-sage-400 rounded-full animate-gentle-pulse" style={{animationDelay: '1s'}}></span>
          </div>
          <p className="text-sage-600 text-zen-sm leading-relaxed mb-zen-md">
            Deepen your practice with structured meditation sessions
          </p>
        </div>
        
        <button
          onClick={() => setShowGuidedMeditations(true)}
          className="zen-button w-full group"
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl group-hover:animate-bounce">🎧</span>
            <span className="font-semibold">Start Guided Session</span>
            <div className="flex items-center space-x-1 text-zen-sm opacity-80">
              <span>•</span>
              <span>Auto check-in</span>
            </div>
          </div>
        </button>
        
        <div className="mt-zen-md text-center">
          <p className="text-zen-xs text-sage-500 italic">
            Choose from 3-15 minute sessions with breathing guidance
          </p>
        </div>
      </div>
      
      {/* Enhanced Weekly View with meditation insights */}
      <div className="zen-card p-zen-xl">
        <div className="text-center mb-zen-lg">
          <div className="inline-flex items-center justify-center space-x-2 mb-zen-sm">
            <span className="w-2 h-2 bg-mint-400 rounded-full animate-gentle-pulse"></span>
            <h3 className="text-zen-xl font-display font-semibold text-sage-800">
              This Week's Journey
            </h3>
            <span className="w-2 h-2 bg-sage-400 rounded-full animate-gentle-pulse" style={{animationDelay: '0.5s'}}></span>
          </div>
          <p className="text-sage-600 text-zen-sm leading-relaxed">
            Each day is a step deeper into mindfulness
          </p>
        </div>
        <WeeklyView checkins={streakData.checkins} />
        <div className="mt-zen-md text-center">
          <p className="text-zen-xs text-sage-500 italic">
            “Peace comes from within. Do not seek it without.”
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <Stats streakData={streakData} />

      {/* Settings */}
      {showSettings && (
        <Settings onDataReset={handleDataReset} />
      )}
      
      {/* Milestone Celebration Modal */}
      {showMilestone && (
        <MilestoneCelebration
          streak={showMilestone}
          onClose={() => setShowMilestone(null)}
          onShare={() => {
            setShowMilestone(null);
            setShowSocialShare(true);
          }}
        />
      )}
      
      {/* Social Share Modal */}
      {showSocialShare && (
        <SocialShare
          streak={streakData?.currentStreak || 0}
          totalSessions={streakData?.totalSessions || 0}
          onClose={() => setShowSocialShare(false)}
        />
      )}
      
      {/* Guided Meditations Modal */}
      {showGuidedMeditations && (
        <GuidedMeditations
          onClose={() => setShowGuidedMeditations(false)}
          onMeditationComplete={handleMeditationComplete}
        />
      )}
      
      {/* Easter Eggs */}
      <ZenEasterEggs streakData={streakData} />
    </div>
  );
};

export default Dashboard;
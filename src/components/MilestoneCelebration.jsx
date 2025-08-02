import { useState, useEffect } from 'react';

const MilestoneCelebration = ({ streak, onClose, onShare }) => {
  const [showParticles, setShowParticles] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Create particle system for celebrations
  const createParticles = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
  };

  const getMilestoneData = (streak) => {
    if (streak >= 365) {
      return {
        title: "Enlightened Soul",
        subtitle: "One full year of mindfulness",
        emoji: "🌟",
        color: "from-gold-400 to-gold-600",
        bgColor: "from-gold-50 to-amber-50",
        message: "You've transcended into a year of daily meditation. You are a beacon of inner peace.",
        achievement: "Zen Master",
        particles: "✨🌟⭐💫🌠",
        shareText: `I've meditated every day for a FULL YEAR! 365 days of mindfulness and inner peace. #ZenStreak365 #MeditationJourney #Mindfulness`
      };
    } else if (streak >= 100) {
      return {
        title: "Zen Master",
        subtitle: "100 days of pure dedication",
        emoji: "🧘‍♂️",
        color: "from-purple-400 to-purple-600",
        bgColor: "from-purple-50 to-indigo-50",
        message: "A century of meditation! Your commitment to inner peace inspires others.",
        achievement: "Meditation Centurion",
        particles: "🌸🧘‍♀️💜🌺✨",
        shareText: `100 days of daily meditation completed! 🧘‍♂️ My mindfulness journey reaches a beautiful milestone. #ZenStreak100 #MeditationChallenge #InnerPeace`
      };
    } else if (streak >= 50) {
      return {
        title: "Mindful Warrior",
        subtitle: "50 days of inner strength",
        emoji: "🌸",
        color: "from-pink-400 to-rose-500",
        bgColor: "from-pink-50 to-rose-50",
        message: "Fifty days of mindfulness! You're building an unshakeable foundation of peace.",
        achievement: "Serenity Seeker",
        particles: "🌸🌺💗🦋✨",
        shareText: `50 days of meditation in a row! 🌸 Finding peace in the daily practice. #ZenStreak50 #Mindfulness #MeditationLife`
      };
    } else if (streak >= 30) {
      return {
        title: "Serenity Keeper",
        subtitle: "A full month of mindfulness",
        emoji: "🌿",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        message: "Thirty days of consistent practice! You've cultivated a beautiful habit of presence.",
        achievement: "Monthly Meditator",
        particles: "🌿🍃🌱💚✨",
        shareText: `30 days of daily meditation achieved! 🌿 Building a stronger, more peaceful mind one day at a time. #ZenStreak30 #MeditationHabit`
      };
    } else if (streak >= 21) {
      return {
        title: "Habit Cultivator",
        subtitle: "21 days of new patterns",
        emoji: "🌱",
        color: "from-green-400 to-green-600",
        bgColor: "from-green-50 to-emerald-50",
        message: "Twenty-one days! Science says you've built a lasting habit of mindfulness.",
        achievement: "Mindful Sprouter",
        particles: "🌱🌿💚🦋✨",
        shareText: `21 days of meditation! 🌱 They say it takes 21 days to build a habit - mindfulness is now part of me! #ZenStreak21 #HabitBuilding`
      };
    } else if (streak >= 14) {
      return {
        title: "Fortnight Focused",
        subtitle: "Two weeks of dedication",
        emoji: "🧘‍♀️",
        color: "from-blue-400 to-blue-600",
        bgColor: "from-blue-50 to-cyan-50",
        message: "Two weeks of daily meditation! Your commitment is blossoming beautifully.",
        achievement: "Calm Cultivator",
        particles: "🧘‍♀️💙🌊🌀✨",
        shareText: `14 days of meditation! 🧘‍♀️ Two weeks of finding my center and growing stronger. #ZenStreak14 #MindfulMoments`
      };
    } else if (streak >= 7) {
      return {
        title: "Weekly Warrior",
        subtitle: "Your first week of mindfulness",
        emoji: "🌅",
        color: "from-orange-400 to-amber-500",
        bgColor: "from-orange-50 to-yellow-50",
        message: "Seven days of meditation! You've started something beautiful.",
        achievement: "First Week Champion",
        particles: "🌅🧡☀️🌼✨",
        shareText: `My first week of daily meditation complete! 🌅 7 days of mindfulness and loving it! #ZenStreak7 #MeditationJourney #StartingStrong`
      };
    }
    return null;
  };

  const milestoneData = getMilestoneData(streak);
  const particles = showParticles ? createParticles() : [];

  useEffect(() => {
    if (milestoneData) {
      // Trigger particles immediately
      setShowParticles(true);
      // Show content after a brief delay
      setTimeout(() => setShowContent(true), 300);
      
      // Auto-hide particles after animation
      setTimeout(() => setShowParticles(false), 5000);
    }
  }, [milestoneData]);

  if (!milestoneData) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${milestoneData.title} - ${streak} Day Meditation Streak!`,
        text: milestoneData.shareText,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(milestoneData.shareText);
      // Show a brief success message
      const button = document.activeElement;
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
    onShare?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Zen Particles */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => {
            const ParticleEmoji = milestoneData.particles[particle.id % milestoneData.particles.length];
            return (
              <div
                key={particle.id}
                className="absolute animate-zen-float text-2xl opacity-80"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                }}
              >
                {ParticleEmoji}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Celebration Card */}
      <div className={`zen-card max-w-md w-full p-zen-2xl text-center relative overflow-hidden ${showContent ? 'animate-zen-celebrate' : 'scale-95 opacity-0'} transition-all duration-700`}>
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${milestoneData.bgColor} opacity-30 animate-breathe`}></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Achievement Badge */}
          <div className="mb-zen-lg">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${milestoneData.color} shadow-zen-xl mb-zen-md animate-gentle-pulse`}>
              <span className="text-4xl text-white drop-shadow-lg">{milestoneData.emoji}</span>
            </div>
            <div className="zen-glow">
              <h2 className="text-zen-3xl font-display font-bold text-zen-800 mb-zen-xs">
                {milestoneData.title}
              </h2>
            </div>
            <p className="text-zen-lg font-medium text-zen-600 mb-zen-sm">
              {milestoneData.subtitle}
            </p>
            <div className={`inline-block px-zen-lg py-zen-sm rounded-zen-lg bg-gradient-to-r ${milestoneData.color} text-white text-zen-sm font-medium shadow-zen`}>
              {milestoneData.achievement}
            </div>
          </div>

          {/* Milestone Message */}
          <div className="mb-zen-xl">
            <p className="text-zen-base text-zen-700 leading-relaxed mb-zen-md">
              {milestoneData.message}
            </p>
            <div className="flex items-center justify-center space-x-2 text-zen-500 text-zen-sm">
              <span className="animate-gentle-pulse">🌟</span>
              <span>You're doing something amazing</span>
              <span className="animate-gentle-pulse" style={{animationDelay: '0.5s'}}>🌟</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-zen-md">
            <button
              onClick={handleShare}
              className="w-full zen-button group"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Share My Achievement</span>
                <span className="group-hover:animate-bounce">📸</span>
              </div>
            </button>
            
            <button
              onClick={onClose}
              className="w-full zen-button-secondary"
            >
              Continue My Journey
            </button>
          </div>

          {/* Inspiring Quote */}
          <div className="mt-zen-lg pt-zen-lg border-t border-zen-200/50">
            <p className="text-zen-xs text-zen-500 italic">
              "The mind is everything. What you think you become." — Buddha
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCelebration;
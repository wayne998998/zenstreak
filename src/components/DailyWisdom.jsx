import { useState, useEffect } from 'react';

const DailyWisdom = ({ onShare }) => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const wisdomQuotes = [
    {
      text: "Peace comes from within. Do not seek it without.",
      author: "Buddha",
      theme: "inner-peace",
      emoji: "🧘‍♀️",
      bgGradient: "from-zen-100/80 to-serenity-100/80"
    },
    {
      text: "The present moment is the only time over which we have dominion.",
      author: "Thích Nhất Hạnh",
      theme: "presence",
      emoji: "🌸",
      bgGradient: "from-lotus-100/80 to-pink-100/80"
    },
    {
      text: "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts and our feelings.",
      author: "Arianna Huffington",
      theme: "awareness",
      emoji: "💭",
      bgGradient: "from-blue-100/80 to-cyan-100/80"
    },
    {
      text: "Your goal is not to battle with the mind, but to witness the mind.",
      author: "Swami Muktananda",
      theme: "observation",
      emoji: "👁️",
      bgGradient: "from-purple-100/80 to-indigo-100/80"
    },
    {
      text: "Meditation is a way for nourishing and blossoming the divinity within you.",
      author: "Amit Ray",
      theme: "growth",
      emoji: "🌱",
      bgGradient: "from-green-100/80 to-emerald-100/80"
    },
    {
      text: "Quiet the mind, and the soul will speak.",
      author: "Ma Jaya Sati Bhagavati",
      theme: "stillness",
      emoji: "🤫",
      bgGradient: "from-gray-100/80 to-slate-100/80"
    },
    {
      text: "The mind is like water. When agitated, it becomes difficult to see. When calm, everything becomes clear.",
      author: "Prasad Mahes",
      theme: "clarity",
      emoji: "🌊",
      bgGradient: "from-blue-100/80 to-teal-100/80"
    },
    {
      text: "Meditation is not about getting anywhere else. It is about being where you are and knowing it.",
      author: "Jon Kabat-Zinn",
      theme: "acceptance",
      emoji: "📍",
      bgGradient: "from-amber-100/80 to-orange-100/80"
    },
    {
      text: "In the depths of winter, I finally learned that there was in me an invincible summer.",
      author: "Albert Camus",
      theme: "resilience",
      emoji: "☀️",
      bgGradient: "from-yellow-100/80 to-amber-100/80"
    },
    {
      text: "The best way to take care of the future is to take care of the present moment.",
      author: "Thích Nhất Hạnh",
      theme: "mindfulness",
      emoji: "⏰",
      bgGradient: "from-zen-100/80 to-green-100/80"
    },
    {
      text: "You are the sky, everything else is just the weather.",
      author: "Pema Chödrön",
      theme: "perspective",
      emoji: "☁️",
      bgGradient: "from-sage-100/80 to-lime-100/80"
    },
    {
      text: "Meditation is the tongue of the soul and the language of our spirit.",
      author: "Jeremy Taylor",
      theme: "connection",
      emoji: "💫",
      bgGradient: "from-mint-100/80 to-sage-100/80"
    }
  ];

  // Get quote based on day of year for consistency
  const getQuoteOfTheDay = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    return wisdomQuotes[dayOfYear % wisdomQuotes.length];
  };

  useEffect(() => {
    setCurrentQuote(getQuoteOfTheDay());
  }, []);

  const handleShare = () => {
    if (!currentQuote) return;
    
    const shareText = `"${currentQuote.text}" — ${currentQuote.author}\n\nDaily wisdom from my meditation journey with ZenStreak 🧘‍♀️ #DailyWisdom #Meditation #Mindfulness`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Daily Meditation Wisdom',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // Visual feedback
      const button = document.activeElement;
      const originalContent = button.innerHTML;
      button.innerHTML = '<span class="flex items-center justify-center space-x-2"><span>Copied!</span><span>✅</span></span>';
      setTimeout(() => {
        button.innerHTML = originalContent;
      }, 2000);
    }
    onShare?.();
  };

  const handleRefresh = () => {
    setIsVisible(false);
    setTimeout(() => {
      // Get a random quote instead of daily for refresh
      const randomQuote = wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)];
      setCurrentQuote(randomQuote);
      setIsVisible(true);
    }, 300);
  };

  if (!currentQuote) return null;

  return (
    <div className={`zen-card p-zen-xl mb-zen-lg relative overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentQuote.bgGradient} animate-breathe`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-zen-lg">
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-gentle-pulse">{currentQuote.emoji}</span>
            <div>
              <h3 className="text-zen-lg font-display font-semibold text-zen-800">
                Daily Wisdom
              </h3>
              <p className="text-zen-xs text-zen-500 capitalize">
                {currentQuote.theme.replace('-', ' ')}
              </p>
            </div>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-zen-sm text-zen-500 hover:text-zen-700 transition-all duration-300 hover:scale-110 rounded-zen hover:bg-zen-50"
            title="Get another quote"
          >
            <span className="text-lg">🔄</span>
          </button>
        </div>

        {/* Quote */}
        <div className="mb-zen-lg">
          <blockquote className="text-zen-base text-zen-700 font-medium leading-relaxed mb-zen-md italic">
            "{currentQuote.text}"
          </blockquote>
          <div className="flex items-center justify-between">
            <cite className="text-zen-sm text-zen-600 font-medium not-italic">
              — {currentQuote.author}
            </cite>
            <div className="flex items-center space-x-1">
              <span className="w-8 h-0.5 bg-gradient-to-r from-transparent via-zen-300 to-transparent rounded-full"></span>
              <span className="text-zen-400 text-zen-xs">wisdom</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-zen-md border-t border-zen-200/50">
          <div className="flex items-center space-x-2 text-zen-500 text-zen-xs">
            <span className="animate-gentle-pulse">✨</span>
            <span>Reflect on this today</span>
          </div>
          
          <button
            onClick={handleShare}
            className="zen-button-secondary text-zen-sm px-zen-md py-zen-sm group"
          >
            <div className="flex items-center space-x-2">
              <span>Share</span>
              <span className="group-hover:animate-bounce">📱</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyWisdom;
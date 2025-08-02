import { useState } from 'react';
import { recordMeditation } from '../utils/storage';
import { meditationTypes } from '../data/meditationTypes';

const CheckInButton = ({ onSuccess }) => {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickCheckIn = async () => {
    setIsLoading(true);
    // Quick check-in with default mindfulness type
    const newData = recordMeditation('mindfulness', 5);
    
    // Add delightful success animation
    setTimeout(() => {
      // Trigger confetti effect
      createSuccessConfetti();
      onSuccess(newData);
      setIsLoading(false);
    }, 600);
  };
  
  const createSuccessConfetti = () => {
    // Create temporary confetti elements
    const confettiEmojis = ['✨', '🌟', '💫', '🎉', '🧘‍♀️'];
    const container = document.body;
    
    for (let i = 0; i < 12; i++) {
      const confetti = document.createElement('div');
      confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
      confetti.className = 'fixed pointer-events-none text-2xl animate-confetti z-50';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = window.innerHeight + 'px';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      
      container.appendChild(confetti);
      
      // Remove after animation
      setTimeout(() => {
        container.removeChild(confetti);
      }, 3000);
    }
  };

  const handleTypeCheckIn = async (type) => {
    setIsLoading(true);
    const newData = recordMeditation(type.id, 5);
    
    setTimeout(() => {
      // Trigger celebration for specific meditation types
      createSuccessConfetti();
      onSuccess(newData);
      setIsLoading(false);
      setShowTypeSelector(false);
    }, 600);
  };

  if (showTypeSelector) {
    return (
      <div className="space-y-zen-lg animate-fade-in-up">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-mint-100 to-sage-100 mb-zen-md">
            <span className="text-xl animate-gentle-pulse">🧘</span>
          </div>
          <h4 className="font-display font-semibold text-sage-800 mb-2">What type of meditation?</h4>
          <p className="text-zen-sm text-sage-600">Choose the practice you embraced today</p>
        </div>
        
        <div className="grid grid-cols-1 gap-zen-sm">
          {meditationTypes.map((type, index) => (
            <button
              key={type.id}
              onClick={() => handleTypeCheckIn(type)}
              disabled={isLoading}
              className="meditation-card transition-all duration-300 hover:shadow-zen disabled:opacity-50"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className="flex items-center space-x-zen-md">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-mint-100 to-sage-100 flex items-center justify-center">
                  <span className="text-lg">{type.emoji}</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-zen-base text-sage-800">{type.name}</div>
                  <div className="text-zen-xs text-sage-600 mt-0.5">{type.description}</div>
                </div>
                <div className="flex-shrink-0 text-sage-400 group-hover:text-sage-600 transition-colors">
                  <span className="text-sm">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="pt-zen-md border-t border-mint-200/50">
          <button
            onClick={() => setShowTypeSelector(false)}
            className="w-full zen-button-secondary text-center"
          >
            <span className="mr-2">←</span> Back to quick check-in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-zen-md">
      <button
        onClick={handleQuickCheckIn}
        disabled={isLoading}
        className={`w-full zen-button transition-all duration-300 ${isLoading ? 'opacity-75 scale-95' : 'hover:scale-[1.02]'}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Embracing the moment...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>Yes, I meditated today!</span>
            <span className="animate-gentle-pulse">✨</span>
          </div>
        )}
      </button>
      
      <button
        onClick={() => setShowTypeSelector(true)}
        disabled={isLoading}
        className="w-full zen-button-secondary group"
      >
        <div className="flex items-center justify-center space-x-2">
          <span>Choose meditation type</span>
          <span className="text-sage-400 group-hover:text-sage-600 transition-colors">→</span>
        </div>
      </button>
    </div>
  );
};

export default CheckInButton;
import { useState, useRef, useEffect } from 'react';

const SocialShare = ({ streak, totalSessions, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('streak');
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef(null);

  const templates = [
    {
      id: 'streak',
      name: 'Streak Achievement',
      bgGradient: 'from-zen-400 via-serenity-400 to-lotus-400',
      textColor: 'text-white',
      emoji: '🔥',
      generateContent: () => ({
        title: `${streak} Day Meditation Streak!`,
        subtitle: 'Committed to daily mindfulness',
        stat: `${streak} consecutive days`,
        message: 'Building inner peace, one day at a time'
      })
    },
    {
      id: 'sessions',
      name: 'Total Sessions',
      bgGradient: 'from-purple-400 via-indigo-400 to-blue-400',
      textColor: 'text-white',
      emoji: '🧘‍♀️',
      generateContent: () => ({
        title: `${totalSessions} Meditation Sessions`,
        subtitle: 'Moments of mindfulness collected',
        stat: `${totalSessions} total sessions`,
        message: 'Every session brings me closer to inner peace'
      })
    },
    {
      id: 'journey',
      name: 'Meditation Journey',
      bgGradient: 'from-green-400 via-emerald-400 to-teal-400',
      textColor: 'text-white',
      emoji: '🌱',
      generateContent: () => ({
        title: 'My Meditation Journey',
        subtitle: 'Growing stronger through mindfulness',
        stat: `${streak} days • ${totalSessions} sessions`,
        message: 'Meditation has transformed my daily life'
      })
    },
    {
      id: 'zen',
      name: 'Zen Wisdom',
      bgGradient: 'from-amber-300 via-orange-300 to-pink-300',
      textColor: 'text-gray-800',
      emoji: '🕉️',
      generateContent: () => ({
        title: 'Finding My Zen',
        subtitle: 'Through daily meditation practice',
        stat: `${streak} consecutive days of peace`,
        message: '"Peace comes from within. Do not seek it without." - Buddha'
      })
    }
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplate);
  const content = currentTemplate?.generateContent();

  const handleShare = async (platform) => {
    setIsGenerating(true);
    
    try {
      // Generate shareable text based on template
      const shareText = generateShareText(currentTemplate, content);
      
      if (platform === 'native' && navigator.share) {
        await navigator.share({
          title: content.title,
          text: shareText,
          url: window.location.href
        });
      } else if (platform === 'copy') {
        await navigator.clipboard.writeText(shareText);
        showToast('Copied to clipboard! 📋');
      } else {
        // Open platform-specific sharing
        const urls = {
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`,
          instagram: shareText, // Copy text for Instagram stories
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
        };
        
        if (urls[platform]) {
          if (platform === 'instagram') {
            await navigator.clipboard.writeText(urls[platform]);
            showToast('Text copied! Add to your Instagram story 📱');
          } else {
            window.open(urls[platform], '_blank', 'width=600,height=400');
          }
        }
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      showToast('Sharing failed, but you\'re still amazing! ✨');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateShareText = (template, content) => {
    const baseTexts = {
      streak: `🔥 ${content.title} Just completed ${streak} consecutive days of meditation! Building inner peace one mindful moment at a time. #MeditationStreak #Mindfulness #ZenLife #DailyPractice`,
      sessions: `🧘‍♀️ ${content.title} completed! Each session brings me closer to inner peace and clarity. The journey of mindfulness continues! #Meditation #MindfulMoments #InnerPeace #WellnessJourney`,
      journey: `🌱 My meditation journey: ${streak} days strong with ${totalSessions} total sessions! Discovering peace through daily practice. #MeditationJourney #Mindfulness #PersonalGrowth #InnerPeace`,
      zen: `🕉️ Finding my zen through ${streak} days of meditation. "${content.message}" Every day brings new wisdom and peace. #Zen #Buddha #Meditation #Wisdom #Mindfulness`
    };
    
    return baseTexts[template.id] || baseTexts.streak;
  };

  const showToast = (message) => {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = 'zen-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="zen-card max-w-lg w-full max-h-[90vh] overflow-y-auto zen-scroll">
        <div className="p-zen-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-zen-lg">
            <div>
              <h3 className="text-zen-xl font-display font-semibold text-zen-800">
                Share Your Journey
              </h3>
              <p className="text-zen-sm text-zen-600">
                Inspire others with your meditation progress
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-zen-sm text-zen-400 hover:text-zen-600 text-xl transition-colors"
            >
              ×
            </button>
          </div>

          {/* Template Selector */}
          <div className="mb-zen-lg">
            <p className="text-zen-sm font-medium text-zen-700 mb-zen-sm">Choose your style:</p>
            <div className="grid grid-cols-2 gap-zen-sm">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-zen-md rounded-zen border-2 transition-all text-left ${
                    selectedTemplate === template.id
                      ? 'border-zen-400 bg-zen-50'
                      : 'border-zen-200 hover:border-zen-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{template.emoji}</span>
                    <span className="text-zen-sm font-medium">{template.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Share Card Preview */}
          <div className="mb-zen-lg">
            <p className="text-zen-sm font-medium text-zen-700 mb-zen-sm">Preview:</p>
            <div 
              ref={cardRef}
              className={`share-card p-zen-xl text-center bg-gradient-to-br ${currentTemplate.bgGradient} ${currentTemplate.textColor} relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <div className="absolute top-4 right-4 text-6xl opacity-20">{currentTemplate.emoji}</div>
                <div className="absolute bottom-4 left-4 text-4xl opacity-20">🧘‍♀️</div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-zen-md">
                  <div className="text-4xl mb-zen-sm animate-gentle-pulse">
                    {currentTemplate.emoji}
                  </div>
                  <h4 className="text-zen-2xl font-display font-bold mb-zen-xs">
                    {content.title}
                  </h4>
                  <p className="text-zen-lg font-medium opacity-90">
                    {content.subtitle}
                  </p>
                </div>

                <div className="mb-zen-md">
                  <div className="inline-block px-zen-lg py-zen-sm bg-white/20 rounded-zen-lg backdrop-blur-sm">
                    <span className="font-bold text-zen-lg">{content.stat}</span>
                  </div>
                </div>

                <p className="text-zen-base opacity-90 italic leading-relaxed mb-zen-md">
                  {content.message}
                </p>

                <div className="flex items-center justify-center space-x-2 text-sm opacity-75">
                  <span>Shared from</span>
                  <span className="font-bold">ZenStreak</span>
                  <span>🧘‍♀️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sharing Options */}
          <div className="space-y-zen-md">
            <p className="text-zen-sm font-medium text-zen-700">Share to:</p>
            
            <div className="grid grid-cols-2 gap-zen-sm">
              {/* Quick Share (Native) */}
              {navigator.share && (
                <button
                  onClick={() => handleShare('native')}
                  disabled={isGenerating}
                  className="zen-button-secondary flex items-center justify-center space-x-2 p-zen-md"
                >
                  <span>📱</span>
                  <span>Quick Share</span>
                </button>
              )}

              {/* Copy to Clipboard */}
              <button
                onClick={() => handleShare('copy')}
                disabled={isGenerating}
                className="zen-button-secondary flex items-center justify-center space-x-2 p-zen-md"
              >
                <span>📋</span>
                <span>Copy Text</span>
              </button>

              {/* Social Platforms */}
              <button
                onClick={() => handleShare('twitter')}
                disabled={isGenerating}
                className="zen-button-secondary flex items-center justify-center space-x-2 p-zen-md bg-blue-50 hover:bg-blue-100 text-blue-700"
              >
                <span>🐦</span>
                <span>Twitter</span>
              </button>

              <button
                onClick={() => handleShare('instagram')}
                disabled={isGenerating}
                className="zen-button-secondary flex items-center justify-center space-x-2 p-zen-md bg-pink-50 hover:bg-pink-100 text-pink-700"
              >
                <span>📸</span>
                <span>Instagram</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                disabled={isGenerating}
                className="zen-button-secondary flex items-center justify-center space-x-2 p-zen-md bg-blue-50 hover:bg-blue-100 text-blue-800"
              >
                <span>📘</span>
                <span>Facebook</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                disabled={isGenerating}
                className="zen-button-secondary flex items-center justify-center space-x-2 p-zen-md bg-blue-50 hover:bg-blue-100 text-blue-900"
              >
                <span>💼</span>
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-zen-lg pt-zen-lg border-t border-zen-200/50 text-center">
            <p className="text-zen-xs text-zen-500 italic">
              Sharing your journey inspires others to start their own ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
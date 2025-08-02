import { useState } from 'react';
import { guidedMeditations } from '../data/guidedMeditations';
import MeditationSession from './MeditationSession';
import MusicSetup from './MusicSetup';
import { SOUND_TYPES } from '../services/audioService';

const GuidedMeditations = ({ onClose, onMeditationComplete }) => {
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [showMusicSetup, setShowMusicSetup] = useState(false);
  const [musicSettings, setMusicSettings] = useState({
    sound: SOUND_TYPES.SILENT,
    volume: 0.3
  });

  if (selectedMeditation && !showMusicSetup) {
    return (
      <MeditationSession
        meditation={selectedMeditation}
        onComplete={onMeditationComplete}
        onBack={() => {
          setSelectedMeditation(null);
          setShowMusicSetup(false);
        }}
        initialMusicSettings={musicSettings}
      />
    );
  }

  if (showMusicSetup && selectedMeditation) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="zen-card max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-zen p-zen-xl border-b border-mint-200/50 rounded-t-zen-xl">
            <div className="flex items-center justify-between mb-zen-md">
              <button
                onClick={() => setShowMusicSetup(false)}
                className="p-zen-md text-sage-500 hover:text-sage-700 hover:bg-sage-100 rounded-zen transition-all duration-200"
              >
                <span className="text-xl">←</span>
              </button>
              <div className="text-center">
                <h2 className="text-zen-xl font-display font-semibold text-sage-800">
                  Setup Your Session
                </h2>
                <p className="text-sage-600 text-zen-sm">
                  {selectedMeditation.title}
                </p>
              </div>
              <div className="w-10"></div>
            </div>
          </div>

          {/* Music Setup */}
          <div className="p-zen-xl">
            <MusicSetup
              selectedSound={musicSettings.sound}
              onSoundChange={(sound) => setMusicSettings(prev => ({ ...prev, sound }))}
              volume={musicSettings.volume}
              onVolumeChange={(volume) => setMusicSettings(prev => ({ ...prev, volume }))}
            />

            {/* Start Meditation Button */}
            <div className="mt-zen-xl space-y-zen-md">
              <button
                onClick={() => setShowMusicSetup(false)}
                className="zen-button w-full flex items-center justify-center space-x-3 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🧘‍♀️</span>
                <span className="font-semibold">Start Meditation</span>
                <span className="text-sage-500 text-zen-sm">({Math.floor(selectedMeditation.duration / 60)} min)</span>
              </button>
              
              <p className="text-center text-zen-xs text-sage-500 italic">
                Find a comfortable position and prepare to begin your journey within
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="zen-card max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-zen p-zen-xl border-b border-mint-200/50 rounded-t-zen-xl">
          <div className="flex items-center justify-between mb-zen-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mint-400 to-sage-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <div>
                <h2 className="text-zen-2xl font-display font-semibold text-sage-800">
                  Guided Meditations
                </h2>
                <p className="text-sage-600 text-zen-sm">
                  Choose your journey within
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-zen-md text-sage-500 hover:text-sage-700 hover:bg-sage-100 rounded-zen transition-all duration-200"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-mint-500 text-zen-xs">
            <span className="w-6 h-0.5 bg-gradient-to-r from-transparent via-mint-300 to-transparent rounded-full animate-zen-float"></span>
            <span className="animate-gentle-pulse">🌱</span>
            <span className="font-medium">Every session counts as a check-in</span>
            <span className="animate-gentle-pulse" style={{animationDelay: '1s'}}>✨</span>
            <span className="w-6 h-0.5 bg-gradient-to-r from-transparent via-sage-300 to-transparent rounded-full animate-zen-float" style={{animationDelay: '2s'}}></span>
          </div>
        </div>

        {/* Meditation Cards */}
        <div className="p-zen-xl space-y-zen-lg">
          {guidedMeditations.map((meditation) => (
            <div
              key={meditation.id}
              onClick={() => {
                setSelectedMeditation(meditation);
                setShowMusicSetup(true);
              }}
              className="meditation-card group cursor-pointer"
            >
              <div className="flex items-start space-x-zen-md">
                {/* Icon & Duration */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-zen-lg bg-gradient-to-br ${meditation.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <span className="text-2xl">{meditation.emoji}</span>
                  </div>
                  <div className="text-center mt-zen-sm">
                    <span className="text-zen-xs text-sage-500 font-medium">
                      {Math.floor(meditation.duration / 60)} min
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-zen-xl font-display font-semibold text-sage-800 mb-zen-xs group-hover:text-sage-900 transition-colors">
                    {meditation.title}
                  </h3>
                  <p className="text-sage-600 text-zen-base mb-zen-sm leading-relaxed">
                    {meditation.description}
                  </p>
                  
                  {/* Phase Count */}
                  <div className="flex items-center space-x-zen-md text-zen-sm">
                    <div className="flex items-center space-x-1 text-mint-500">
                      <span className="w-2 h-2 bg-mint-400 rounded-full"></span>
                      <span className="font-medium">{meditation.phases.length} phases</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sage-500">
                      <span>•</span>
                      <span>Text guidance</span>
                    </div>
                    <div className="flex items-center space-x-1 text-lime-500">
                      <span>•</span>
                      <span>Breathing animation</span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 self-center">
                  <div className="w-8 h-8 rounded-full bg-sage-100 group-hover:bg-sage-200 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <span className="text-sage-600 group-hover:text-sage-700">→</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar Preview */}
              <div className="mt-zen-md">
                <div className="h-1 bg-sage-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-mint-400 to-sage-400 rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                </div>
              </div>
            </div>
          ))}

          {/* Footer Message */}
          <div className="text-center py-zen-lg border-t border-mint-100 mt-zen-xl">
            <div className="inline-flex items-center justify-center space-x-2 text-sage-600 text-zen-sm">
              <span className="animate-gentle-pulse">🌸</span>
              <span className="italic">Find your center, one breath at a time</span>
              <span className="animate-gentle-pulse" style={{animationDelay: '1s'}}>🌸</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedMeditations;
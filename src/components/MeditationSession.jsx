import { useState, useEffect, useRef } from 'react';
import { formatTime, getCurrentPhase, getCurrentGuidance } from '../data/guidedMeditations';
import BreathingAnimation from './BreathingAnimation';
import MusicControls from './MusicControls';
import { SOUND_TYPES } from '../services/audioService';

const MeditationSession = ({ meditation, onComplete, onBack, initialMusicSettings }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);
  
  // Music state
  const [selectedSound, setSelectedSound] = useState(initialMusicSettings?.sound || SOUND_TYPES.SILENT);
  const [volume, setVolume] = useState(initialMusicSettings?.volume || 0.3);

  const currentPhaseData = getCurrentPhase(meditation, elapsedTime);
  const currentGuidance = getCurrentGuidance(currentPhaseData.phase, currentPhaseData.phaseElapsed);
  const remainingTime = meditation.duration - elapsedTime;
  const progress = (elapsedTime / meditation.duration) * 100;

  useEffect(() => {
    if (isPlaying && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          if (newTime >= meditation.duration) {
            setIsCompleted(true);
            setIsPlaying(false);
            return meditation.duration;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, isCompleted, meditation.duration]);

  useEffect(() => {
    if (isCompleted) {
      onComplete?.();
    }
  }, [isCompleted, onComplete]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSoundChange = (newSound) => {
    setSelectedSound(newSound);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleReset = () => {
    setElapsedTime(0);
    setIsPlaying(false);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="zen-card max-w-md w-full text-center p-zen-2xl">
          <div className="success-checkmark mb-zen-lg">🌟</div>
          <h2 className="text-zen-2xl font-display font-semibold text-sage-800 mb-zen-md">
            Meditation Complete
          </h2>
          <p className="text-sage-600 text-zen-lg mb-zen-lg leading-relaxed">
            Beautiful work! You've completed your {meditation.title} session.
          </p>
          
          <div className="zen-card bg-gradient-to-br from-mint-50 to-sage-50 p-zen-lg mb-zen-lg">
            <p className="text-zen-sm text-sage-700 italic mb-zen-sm">
              "Peace comes from within. Do not seek it without."
            </p>
            <p className="text-zen-xs text-sage-500">— Buddha</p>
          </div>

          <div className="flex items-center justify-center space-x-3 text-mint-500 text-zen-sm mb-zen-xl">
            <span className="animate-gentle-pulse">🧘‍♀️</span>
            <span className="font-medium">This session counts as your daily check-in</span>
            <span className="animate-gentle-pulse" style={{animationDelay: '1s'}}>✨</span>
          </div>

          <div className="space-y-zen-md">
            <button
              onClick={onBack}
              className="zen-button w-full"
            >
              Back to Meditations
            </button>
            <button
              onClick={() => {
                handleReset();
                setIsCompleted(false);
              }}
              className="zen-button-secondary w-full"
            >
              Meditate Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="zen-card max-w-lg w-full max-h-[95vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-zen-xl border-b border-mint-200/50">
          <div className="flex items-center justify-between mb-zen-md">
            <button
              onClick={onBack}
              className="p-zen-md text-sage-500 hover:text-sage-700 hover:bg-sage-100 rounded-zen transition-all duration-200"
            >
              <span className="text-xl">←</span>
            </button>
            <div className="text-center">
              <h2 className="text-zen-xl font-display font-semibold text-sage-800">
                {meditation.title}
              </h2>
              <p className="text-sage-600 text-zen-sm">
                {currentPhaseData.phase.title}
              </p>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>

          {/* Progress Bar */}
          <div className="mb-zen-md">
            <div className="flex items-center justify-between text-zen-sm text-sage-500 mb-zen-sm">
              <span>{formatTime(elapsedTime)}</span>
              <span>{formatTime(remainingTime)}</span>
            </div>
            <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-mint-400 to-sage-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Phase Progress */}
          <div className="flex items-center justify-center space-x-2">
            {meditation.phases.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPhaseData.phaseIndex
                    ? 'bg-mint-400 scale-125'
                    : index < currentPhaseData.phaseIndex
                    ? 'bg-sage-400'
                    : 'bg-sage-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Music Controls */}
        <div className="px-zen-xl pt-zen-md">
          <MusicControls
            selectedSound={selectedSound}
            onSoundChange={handleSoundChange}
            volume={volume}
            onVolumeChange={handleVolumeChange}
            isPlaying={isPlaying}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-zen-xl text-center space-y-zen-lg overflow-y-auto">
          {/* Breathing Animation */}
          <div className="flex justify-center">
            <BreathingAnimation isPlaying={isPlaying} />
          </div>

          {/* Current Guidance */}
          <div className="zen-card bg-gradient-to-br from-mint-50/50 to-sage-50/50 p-zen-lg">
            <p className="text-zen-base text-sage-800 leading-relaxed font-medium">
              {currentGuidance}
            </p>
          </div>

          {/* Phase Indicator */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-zen-sm text-sage-600 mb-zen-sm">
              <span className="w-2 h-2 bg-mint-400 rounded-full animate-gentle-pulse"></span>
              <span>Phase {currentPhaseData.phaseIndex + 1} of {meditation.phases.length}</span>
              <span className="w-2 h-2 bg-sage-400 rounded-full animate-gentle-pulse" style={{animationDelay: '1s'}}></span>
            </div>
            <div className="h-1 w-24 mx-auto bg-sage-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-mint-400 to-sage-400 rounded-full transition-all duration-300"
                style={{ width: `${currentPhaseData.phaseProgress * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sticky Controls at Bottom */}
        <div className="sticky bottom-0 p-zen-xl border-t border-mint-200/50 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-zen-lg mb-zen-md">
            <button
              onClick={handleReset}
              className="zen-button-secondary flex items-center space-x-2 group"
              disabled={elapsedTime === 0}
            >
              <span className="group-hover:animate-spin">⟲</span>
              <span>Reset</span>
            </button>

            <button
              onClick={handlePlayPause}
              className="zen-button flex items-center justify-center space-x-3 px-zen-2xl py-zen-lg group min-h-[60px] text-lg font-bold shadow-lg"
              style={{ zIndex: 100 }}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {isPlaying ? '⏸️' : '▶️'}
              </span>
              <span className="font-bold text-lg">
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-zen-xs text-sage-500 italic">
              {isPlaying ? 'Close your eyes and follow the guidance' : 'Press play to begin'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationSession;
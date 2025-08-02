import { useState, useEffect } from 'react';
import { audioService, SOUND_TYPES, SOUND_CONFIGS } from '../services/audioService';

const MusicControls = ({ 
  selectedSound = SOUND_TYPES.SILENT, 
  onSoundChange,
  volume = 0.3,
  onVolumeChange,
  isPlaying = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  // Initialize audio service when component mounts
  useEffect(() => {
    const initAudio = async () => {
      try {
        await audioService.initialize();
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    };
    initAudio();

    return () => {
      // Cleanup on unmount
      audioService.cleanup();
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (audioService.isInitialized) {
      audioService.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Handle sound changes
  useEffect(() => {
    if (audioService.isInitialized && isPlaying && selectedSound !== SOUND_TYPES.SILENT) {
      const soundConfig = SOUND_CONFIGS[selectedSound];
      if (soundConfig?.playFunction) {
        // Resume context if needed (browser requirement)
        audioService.resumeContext().then(() => {
          soundConfig.playFunction();
          audioService.fadeIn(0.5);
        });
      }
    } else if (!isPlaying || selectedSound === SOUND_TYPES.SILENT) {
      audioService.fadeOut(0.5);
      setTimeout(() => audioService.stopAll(), 500);
    }
  }, [selectedSound, isPlaying]);

  const handleSoundSelect = async (soundType) => {
    try {
      // Initialize audio on first user interaction if needed
      if (!audioService.isInitialized) {
        await audioService.initialize();
      }
      
      onSoundChange(soundType);
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to change sound:', error);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    onVolumeChange(newVolume);
    
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(previousVolume);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      onVolumeChange(0);
    }
  };

  const currentSoundConfig = SOUND_CONFIGS[selectedSound];

  return (
    <div className="music-controls">
      {/* Compact Controls */}
      <div className="flex items-center justify-between p-zen-md bg-gradient-to-r from-mint-50/50 to-sage-50/50 rounded-zen-lg border border-mint-200/30">
        {/* Current Sound Display */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-zen bg-gradient-to-br from-mint-400 to-sage-500 flex items-center justify-center text-white text-zen-sm shadow-sm">
              {currentSoundConfig.emoji}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-zen-sm font-medium text-sage-800 truncate">
              {currentSoundConfig.name}
            </p>
            <p className="text-zen-xs text-sage-500 truncate">
              {currentSoundConfig.description}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-2 text-sage-500 hover:text-sage-700 hover:bg-sage-100 rounded-zen transition-all duration-200"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <span className="text-zen-sm">
                {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </span>
            </button>
            <div className="relative group">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-2 bg-sage-200 rounded-full appearance-none cursor-pointer
                         slider:bg-gradient-to-r slider:from-mint-400 slider:to-sage-400
                         focus:outline-none focus:ring-2 focus:ring-mint-300 focus:ring-opacity-50"
                style={{
                  background: `linear-gradient(to right, 
                    rgb(74 222 128) 0%, 
                    rgb(34 197 94) ${(isMuted ? 0 : volume) * 100}%, 
                    rgb(229 231 235) ${(isMuted ? 0 : volume) * 100}%, 
                    rgb(229 231 235) 100%)`
                }}
              />
              {/* Volume tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-sage-800 text-white text-zen-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </div>
            </div>
          </div>

          {/* Sound Selection Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-sage-500 hover:text-sage-700 hover:bg-sage-100 rounded-zen transition-all duration-200"
            title="Change background sound"
          >
            <span className="text-zen-sm">⚙️</span>
          </button>
        </div>
      </div>

      {/* Expanded Sound Selection */}
      {isExpanded && (
        <div className="mt-zen-md p-zen-md bg-white rounded-zen-lg border border-mint-200 shadow-lg animate-zen-slide-in">
          <div className="mb-zen-md">
            <h4 className="text-zen-base font-medium text-sage-800 mb-zen-xs">
              Background Music
            </h4>
            <p className="text-zen-xs text-sage-500">
              Choose ambient sounds for your meditation
            </p>
          </div>

          <div className="grid grid-cols-2 gap-zen-sm">
            {Object.entries(SOUND_CONFIGS).map(([soundType, config]) => (
              <button
                key={soundType}
                onClick={() => handleSoundSelect(soundType)}
                className={`p-zen-md rounded-zen border-2 text-left transition-all duration-200 group
                  ${selectedSound === soundType
                    ? 'border-mint-400 bg-gradient-to-br from-mint-50 to-sage-50 shadow-sm'
                    : 'border-sage-200 hover:border-mint-300 hover:bg-sage-50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-zen flex items-center justify-center text-zen-sm shadow-sm transition-all duration-200
                    ${selectedSound === soundType
                      ? 'bg-gradient-to-br from-mint-400 to-sage-500 text-white'
                      : 'bg-sage-100 group-hover:bg-sage-200'
                    }`}>
                    {config.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-zen-sm font-medium transition-colors duration-200
                      ${selectedSound === soundType ? 'text-sage-800' : 'text-sage-700 group-hover:text-sage-800'}
                    `}>
                      {config.name}
                    </p>
                    <p className={`text-zen-xs transition-colors duration-200
                      ${selectedSound === soundType ? 'text-sage-600' : 'text-sage-500'}
                    `}>
                      {config.description}
                    </p>
                  </div>
                  {selectedSound === soundType && (
                    <div className="flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-mint-400 flex items-center justify-center">
                        <span className="text-white text-zen-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-zen-md pt-zen-md border-t border-sage-100">
            <p className="text-zen-xs text-sage-500 text-center italic">
              {selectedSound === SOUND_TYPES.SILENT 
                ? 'Enjoy the silence and focus on your breath' 
                : 'All sounds are generated synthetically for optimal performance'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicControls;
import { SOUND_TYPES, SOUND_CONFIGS } from '../services/audioService';

const MusicSetup = ({ 
  selectedSound = SOUND_TYPES.SILENT, 
  onSoundChange,
  volume = 0.3,
  onVolumeChange 
}) => {
  
  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className="music-setup">
      <div className="mb-zen-lg">
        <div className="flex items-center space-x-3 mb-zen-md">
          <div className="w-10 h-10 rounded-zen-lg bg-gradient-to-br from-mint-400 to-sage-500 flex items-center justify-center shadow-lg">
            <span className="text-xl">🎵</span>
          </div>
          <div>
            <h3 className="text-zen-lg font-display font-semibold text-sage-800">
              Background Music
            </h3>
            <p className="text-sage-600 text-zen-sm">
              Choose ambient sounds to enhance your meditation
            </p>
          </div>
        </div>

        {/* Sound Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-zen-md">
          {Object.entries(SOUND_CONFIGS).map(([soundType, config]) => (
            <button
              key={soundType}
              onClick={() => onSoundChange(soundType)}
              className={`p-zen-lg rounded-zen-lg border-2 text-left transition-all duration-200 group
                ${selectedSound === soundType
                  ? 'border-mint-400 bg-gradient-to-br from-mint-50 to-sage-50 shadow-md scale-105'
                  : 'border-sage-200 hover:border-mint-300 hover:bg-sage-50 hover:scale-102'
                }`}
            >
              <div className="flex items-center space-x-zen-md">
                <div className={`w-12 h-12 rounded-zen-lg flex items-center justify-center text-xl shadow-sm transition-all duration-200
                  ${selectedSound === soundType
                    ? 'bg-gradient-to-br from-mint-400 to-sage-500 text-white'
                    : 'bg-sage-100 group-hover:bg-sage-200'
                  }`}>
                  {config.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className={`text-zen-base font-medium transition-colors duration-200
                    ${selectedSound === soundType ? 'text-sage-800' : 'text-sage-700 group-hover:text-sage-800'}
                  `}>
                    {config.name}
                  </h4>
                  <p className={`text-zen-sm transition-colors duration-200
                    ${selectedSound === soundType ? 'text-sage-600' : 'text-sage-500'}
                  `}>
                    {config.description}
                  </p>
                </div>
                {selectedSound === soundType && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-mint-400 flex items-center justify-center shadow-sm">
                      <span className="text-white text-zen-sm">✓</span>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Volume Control */}
        {selectedSound !== SOUND_TYPES.SILENT && (
          <div className="mt-zen-lg">
            <div className="zen-card bg-gradient-to-br from-mint-50/50 to-sage-50/50 p-zen-lg">
              <div className="flex items-center justify-between mb-zen-md">
                <div className="flex items-center space-x-2">
                  <span className="text-zen-sm">🔊</span>
                  <label className="text-zen-sm font-medium text-sage-700">
                    Volume
                  </label>
                </div>
                <span className="text-zen-sm text-sage-600 font-medium">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-3 bg-sage-200 rounded-zen-lg appearance-none cursor-pointer
                           slider:bg-gradient-to-r slider:from-mint-400 slider:to-sage-400
                           focus:outline-none focus:ring-2 focus:ring-mint-300 focus:ring-opacity-50"
                  style={{
                    background: `linear-gradient(to right, 
                      rgb(74 222 128) 0%, 
                      rgb(34 197 94) ${volume * 100}%, 
                      rgb(229 231 235) ${volume * 100}%, 
                      rgb(229 231 235) 100%)`
                  }}
                />
                
                {/* Volume indicator dots */}
                <div className="flex justify-between mt-zen-sm px-1">
                  {[0, 0.25, 0.5, 0.75, 1].map((value) => (
                    <div
                      key={value}
                      className={`w-1 h-1 rounded-full transition-all duration-200
                        ${volume >= value ? 'bg-mint-400' : 'bg-sage-300'}
                      `}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-zen-xs text-sage-500 mt-zen-sm">
                <span>Quiet</span>
                <span>Comfortable</span>
                <span>Immersive</span>
              </div>
            </div>
          </div>
        )}

        {/* Preview Note */}
        <div className="mt-zen-lg text-center">
          <div className="inline-flex items-center space-x-2 text-sage-600 text-zen-sm bg-sage-50 px-zen-md py-zen-sm rounded-zen border border-sage-200">
            <span className="animate-gentle-pulse">💡</span>
            <span className="italic">
              {selectedSound === SOUND_TYPES.SILENT 
                ? 'Pure silence helps you focus deeply on your inner awareness'
                : 'Background music will start automatically when you begin meditation'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicSetup;
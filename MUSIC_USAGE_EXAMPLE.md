# ZenStreak Music Feature - Usage Examples

## How to Test the Music Feature

### 1. Basic Usage Flow
```
1. Open ZenStreak app
2. Click "Guided Meditations" 
3. Select any meditation (e.g., "5-Minute Breathing")
4. Music setup screen appears automatically
5. Choose a background sound (Forest, Ocean, Rain, etc.)
6. Adjust volume slider
7. Click "Start Meditation"
8. Music begins playing with meditation
```

### 2. During Meditation
```
- Music controls appear at top of meditation session
- Click volume icon to mute/unmute
- Drag volume slider to adjust
- Click gear icon to change sound type
- Music auto-pauses when meditation is paused
```

### 3. Sound Types Available

#### 🌲 Forest Sounds
- Gentle wind through trees
- Random bird chirps every 3-8 seconds
- Subtle leaf rustling
- **Best for**: Nature connection, stress relief

#### 🌊 Ocean Waves
- Realistic wave sounds with LFO modulation
- Continuous but varied wave patterns
- Soothing low-frequency content
- **Best for**: Deep relaxation, sleep preparation

#### 🌧️ Rain Drops
- Soft rainfall background
- Random droplet sounds
- Filtered for gentle listening
- **Best for**: Focus, concentration

#### 🔇 White Noise
- Consistent background sound
- Masks external distractions
- Smooth, even frequency response
- **Best for**: Focus in noisy environments

#### 🎵 Tibetan Singing Bowls
- Harmonic oscillators create realistic bowl sounds
- Periodic strikes every 8-20 seconds
- Multiple harmonics for rich sound
- **Best for**: Spiritual practice, deep meditation

#### 🔇 Silent
- No background music
- Pure focus on breath and guidance
- **Best for**: Traditional meditation practice

## Developer Notes

### Audio Service Usage
```javascript
import { audioService, SOUND_TYPES } from '../services/audioService';

// Initialize (user interaction required)
await audioService.initialize();

// Play a sound
audioService.playForestSounds();
audioService.setVolume(0.5);

// Stop all sounds
audioService.stopAll();
```

### Using Music Controls Component
```jsx
import MusicControls from './MusicControls';

<MusicControls
  selectedSound={selectedSound}
  onSoundChange={handleSoundChange}
  volume={volume}
  onVolumeChange={handleVolumeChange}
  isPlaying={isPlaying}
/>
```

### Using Audio Preferences Hook
```jsx
import { useAudioPreferences } from '../hooks/useAudioPreferences';

const { preferences, updatePreference } = useAudioPreferences();

// Update a preference
updatePreference('volume', 0.7);
updatePreference('sound', SOUND_TYPES.OCEAN);
```

## Testing Checklist

### ✅ Basic Functionality
- [ ] Music setup appears when selecting meditation
- [ ] All 6 sound types work (including silent)
- [ ] Volume control responds correctly
- [ ] Mute/unmute toggles properly
- [ ] Music starts/stops with meditation

### ✅ User Experience
- [ ] Settings persist across sessions
- [ ] Smooth fade in/out transitions
- [ ] Mobile-friendly touch targets
- [ ] Responsive design on different screen sizes
- [ ] Visual feedback for all interactions

### ✅ Performance
- [ ] No audio dropouts or glitches
- [ ] Smooth playback on mobile devices
- [ ] Low CPU usage during playback
- [ ] Proper cleanup when closing app
- [ ] No memory leaks with long sessions

### ✅ Accessibility
- [ ] Works with reduced motion preferences
- [ ] High contrast mode support
- [ ] Keyboard navigation possible
- [ ] Screen reader compatibility
- [ ] Touch target sizes appropriate

### ✅ Browser Compatibility
- [ ] Chrome (desktop/mobile)
- [ ] Safari (desktop/mobile)
- [ ] Firefox (desktop/mobile)
- [ ] Edge (desktop)
- [ ] Graceful fallback for unsupported browsers

## Known Limitations
1. **Browser Policy**: Audio requires user interaction to start
2. **Mobile Safari**: May have slight delays in audio context initialization
3. **Older Browsers**: Web Audio API not supported in very old browsers
4. **Background Apps**: Audio may pause when app loses focus (mobile)

## Future Enhancements
- Custom soundscape mixing
- Binaural beats for deeper states
- Nature sound variations (different forests, beaches)
- User-uploaded custom sounds
- Adaptive volume based on meditation phase
- Audio visualizations during playback
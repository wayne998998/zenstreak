# ZenStreak Background Music Feature

## Overview
The ZenStreak app now includes comprehensive background music functionality for guided meditation sessions. This feature uses the Web Audio API to generate synthetic ambient sounds that enhance the meditation experience.

## Features Implemented

### 🎵 Audio Service (`src/services/audioService.js`)
- **Web Audio API Integration**: Generates realistic synthetic sounds
- **Multiple Sound Types**:
  - 🌲 Forest Sounds (birds, wind, leaves)
  - 🌊 Ocean Waves (with LFO wave motion)
  - 🌧️ Rain Drops (filtered noise with random drops)
  - 🔇 White Noise (consistent background)
  - 🎵 Tibetan Singing Bowls (harmonic oscillators)
  - 🔇 Silent (no background music)

### 🎛️ Music Controls (`src/components/MusicControls.jsx`)
- **Compact Interface**: Shows current sound with description
- **Volume Control**: Interactive slider with visual feedback
- **Mute/Unmute**: Quick toggle functionality
- **Sound Selection**: Expandable grid with preview descriptions
- **Real-time Updates**: Instant feedback and smooth transitions

### ⚙️ Music Setup (`src/components/MusicSetup.jsx`)
- **Pre-session Configuration**: Choose music before meditation starts
- **Visual Sound Grid**: Clear icons and descriptions for each option
- **Volume Preview**: Adjust levels before starting
- **Responsive Design**: Works on mobile and desktop

### 🧘‍♀️ Session Integration
- **Automatic Start/Stop**: Music syncs with meditation play/pause
- **Smooth Transitions**: Fade in/out effects for natural feel
- **Memory**: Remembers user preferences across sessions
- **Performance Optimized**: Efficient audio generation and cleanup

## Technical Implementation

### Audio Generation
```javascript
// Forest sounds with multiple layers
- Wind through trees (filtered noise)
- Random bird chirps (oscillators)
- Leaves rustling (high-pass filtered noise)

// Ocean waves with realistic motion
- Base wave sound (low-pass filtered noise)
- LFO modulation for wave motion
- Natural ebb and flow patterns

// Singing bowls with harmonics
- Multiple harmonic oscillators
- Realistic metal bowl frequencies
- Periodic strikes for authenticity
```

### User Experience
1. **Select Meditation** → Shows music setup screen
2. **Choose Background Sound** → Visual grid with previews
3. **Adjust Volume** → Real-time slider with percentage
4. **Start Session** → Music begins with meditation
5. **Control During Session** → Compact controls available
6. **Auto-pause** → Music stops when meditation pauses

### Memory & Preferences
- User settings saved to localStorage
- Consistent experience across sessions
- Smart defaults for new users
- Accessibility support for reduced motion

## Mobile Optimization
- Touch-friendly controls (48px minimum targets)
- Responsive grid layouts
- Smooth animations that respect user preferences
- Efficient battery usage with optimized audio loops

## Accessibility Features
- High contrast mode support
- Reduced motion preferences respected
- Keyboard navigation support
- Screen reader friendly labels
- Volume tooltips and visual feedback

## Performance Considerations
- Synthetic audio generation (no large audio files)
- Efficient Web Audio API usage
- Proper cleanup and memory management
- Smooth fade transitions
- Minimal CPU usage for background generation

## Integration Points
- **MeditationSession**: Main meditation component with integrated controls
- **GuidedMeditations**: Setup flow before starting sessions
- **Audio Service**: Centralized audio management
- **Preferences Hook**: Persistent user settings

## Browser Compatibility
- Modern browsers with Web Audio API support
- Graceful fallback for older browsers
- User interaction required for audio (browser policy compliance)
- Optimized for mobile Safari and Chrome

## Files Created/Modified
- ✅ `src/services/audioService.js` - Core audio functionality
- ✅ `src/components/MusicControls.jsx` - Session controls
- ✅ `src/components/MusicSetup.jsx` - Pre-session setup
- ✅ `src/hooks/useAudioPreferences.js` - Preference management
- ✅ `src/components/MeditationSession.jsx` - Integration
- ✅ `src/components/GuidedMeditations.jsx` - Setup flow
- ✅ `src/index.css` - Music-specific styles

The implementation provides a complete, professional-grade background music system that enhances the meditation experience while maintaining the app's zen aesthetic and performance standards.
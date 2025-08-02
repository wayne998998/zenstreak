/**
 * Audio Service for ZenStreak Meditation App
 * Generates synthetic ambient sounds using Web Audio API
 */

class AudioService {
  constructor() {
    this.audioContext = null;
    this.currentNodes = new Map(); // Track active audio nodes
    this.masterGain = null;
    this.isInitialized = false;
  }

  // Initialize audio context (requires user interaction)
  async initialize() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // Default volume
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw error;
    }
  }

  // Resume audio context if suspended (required by browser policies)
  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Set master volume (0 to 1)
  setVolume(volume) {
    if (this.masterGain) {
      // Smooth volume transition
      this.masterGain.gain.setTargetAtTime(volume, this.audioContext.currentTime, 0.1);
    }
  }

  // Get current volume
  getVolume() {
    return this.masterGain ? this.masterGain.gain.value : 0;
  }

  // Stop all currently playing sounds
  stopAll() {
    this.currentNodes.forEach((nodes) => {
      nodes.forEach(node => {
        try {
          if (node.gain) {
            // Fade out before stopping
            node.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.1);
            setTimeout(() => {
              if (node.oscillator) node.oscillator.stop();
              if (node.source) node.source.stop();
            }, 200);
          }
        } catch {
          // Node might already be stopped
        }
      });
    });
    this.currentNodes.clear();
  }

  // Forest sounds - birds, wind, leaves
  playForestSounds() {
    this.stopAll();
    
    const nodes = [];

    // Wind through trees (filtered noise)
    const windNoise = this.audioContext.createBufferSource();
    const windBuffer = this.createNoiseBuffer(4, 0.1);
    windNoise.buffer = windBuffer;
    windNoise.loop = true;

    const windFilter = this.audioContext.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 200;
    windFilter.Q.value = 1;

    const windGain = this.audioContext.createGain();
    windGain.gain.value = 0.15;

    windNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    windNoise.start();

    nodes.push({ source: windNoise, gain: windGain });

    // Bird chirps (random oscillators)
    this.createBirdChirps(nodes);

    // Leaves rustling (high-frequency filtered noise)
    const leavesNoise = this.audioContext.createBufferSource();
    const leavesBuffer = this.createNoiseBuffer(2, 0.05);
    leavesNoise.buffer = leavesBuffer;
    leavesNoise.loop = true;

    const leavesFilter = this.audioContext.createBiquadFilter();
    leavesFilter.type = 'highpass';
    leavesFilter.frequency.value = 1000;

    const leavesGain = this.audioContext.createGain();
    leavesGain.gain.value = 0.08;

    leavesNoise.connect(leavesFilter);
    leavesFilter.connect(leavesGain);
    leavesGain.connect(this.masterGain);
    leavesNoise.start();

    nodes.push({ source: leavesNoise, gain: leavesGain });

    this.currentNodes.set('forest', nodes);
  }

  // Ocean waves
  playOceanWaves() {
    this.stopAll();
    
    const nodes = [];

    // Create wave sound using filtered noise with LFO
    const waveNoise = this.audioContext.createBufferSource();
    const waveBuffer = this.createNoiseBuffer(8, 0.3);
    waveNoise.buffer = waveBuffer;
    waveNoise.loop = true;

    const waveFilter = this.audioContext.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.value = 400;
    waveFilter.Q.value = 2;

    // LFO for wave motion
    const lfo = this.audioContext.createOscillator();
    lfo.frequency.value = 0.1; // Slow wave motion
    const lfoGain = this.audioContext.createGain();
    lfoGain.gain.value = 200;
    
    lfo.connect(lfoGain);
    lfoGain.connect(waveFilter.frequency);

    const waveGain = this.audioContext.createGain();
    waveGain.gain.value = 0.25;

    waveNoise.connect(waveFilter);
    waveFilter.connect(waveGain);
    waveGain.connect(this.masterGain);
    
    waveNoise.start();
    lfo.start();

    nodes.push({ source: waveNoise, oscillator: lfo, gain: waveGain });

    this.currentNodes.set('ocean', nodes);
  }

  // Rain drops
  playRainSounds() {
    this.stopAll();
    
    const nodes = [];

    // Main rain (filtered noise)
    const rainNoise = this.audioContext.createBufferSource();
    const rainBuffer = this.createNoiseBuffer(6, 0.2);
    rainNoise.buffer = rainBuffer;
    rainNoise.loop = true;

    const rainFilter = this.audioContext.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.value = 800;
    rainFilter.Q.value = 3;

    const rainGain = this.audioContext.createGain();
    rainGain.gain.value = 0.2;

    rainNoise.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.masterGain);
    rainNoise.start();

    nodes.push({ source: rainNoise, gain: rainGain });

    // Occasional raindrops (random impulses)
    this.createRainDrops(nodes);

    this.currentNodes.set('rain', nodes);
  }

  // White noise
  playWhiteNoise() {
    this.stopAll();
    
    const noiseSource = this.audioContext.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer(4, 0.5);
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.value = 0.15;

    noiseSource.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseSource.start();

    this.currentNodes.set('whitenoise', [{ source: noiseSource, gain: noiseGain }]);
  }

  // Tibetan singing bowls (synthesized)
  playSingingBowls() {
    this.stopAll();
    
    const nodes = [];

    // Create multiple harmonic oscillators for bowl sound
    const fundamentalFreq = 220; // A3
    const harmonics = [1, 2.1, 3.2, 4.8, 6.1]; // Realistic harmonic series for metal bowl

    harmonics.forEach((harmonic, index) => {
      const oscillator = this.audioContext.createOscillator();
      oscillator.frequency.value = fundamentalFreq * harmonic;
      oscillator.type = 'sine';

      const gain = this.audioContext.createGain();
      const amplitude = 1 / (index + 1); // Each harmonic gets quieter
      gain.gain.value = amplitude * 0.1;

      // Add slight detuning for natural sound
      const detune = (Math.random() - 0.5) * 10;
      oscillator.detune.value = detune;

      oscillator.connect(gain);
      gain.connect(this.masterGain);
      oscillator.start();

      nodes.push({ oscillator, gain });
    });

    // Periodic strikes
    this.createBowlStrikes(nodes);

    this.currentNodes.set('bowls', nodes);
  }

  // Helper method to create noise buffer
  createNoiseBuffer(lengthInSeconds, intensity = 1) {
    const sampleRate = this.audioContext.sampleRate;
    const bufferLength = sampleRate * lengthInSeconds;
    const buffer = this.audioContext.createBuffer(2, bufferLength, sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < bufferLength; i++) {
        channelData[i] = (Math.random() * 2 - 1) * intensity;
      }
    }

    return buffer;
  }

  // Create random bird chirps
  createBirdChirps(nodes) {
    const chirpInterval = setInterval(() => {
      if (!this.currentNodes.has('forest')) {
        clearInterval(chirpInterval);
        return;
      }

      // Random bird chirp
      const chirp = this.audioContext.createOscillator();
      const chirpGain = this.audioContext.createGain();
      
      // Random frequency for different bird types
      const frequency = 800 + Math.random() * 1200;
      chirp.frequency.value = frequency;
      chirp.type = 'sine';

      chirpGain.gain.value = 0;
      chirpGain.gain.setTargetAtTime(0.05, this.audioContext.currentTime, 0.01);
      chirpGain.gain.setTargetAtTime(0, this.audioContext.currentTime + 0.2, 0.05);

      chirp.connect(chirpGain);
      chirpGain.connect(this.masterGain);
      chirp.start();
      chirp.stop(this.audioContext.currentTime + 0.3);

    }, 3000 + Math.random() * 5000); // Random interval between chirps
  }

  // Create random raindrops
  createRainDrops(nodes) {
    const dropInterval = setInterval(() => {
      if (!this.currentNodes.has('rain')) {
        clearInterval(dropInterval);
        return;
      }

      // Create quick impulse for raindrop
      const drop = this.audioContext.createOscillator();
      const dropGain = this.audioContext.createGain();
      
      drop.frequency.value = 2000 + Math.random() * 1000;
      drop.type = 'sine';

      dropGain.gain.value = 0;
      dropGain.gain.setTargetAtTime(0.02, this.audioContext.currentTime, 0.001);
      dropGain.gain.setTargetAtTime(0, this.audioContext.currentTime + 0.05, 0.01);

      drop.connect(dropGain);
      dropGain.connect(this.masterGain);
      drop.start();
      drop.stop(this.audioContext.currentTime + 0.1);

    }, 100 + Math.random() * 300); // Frequent small drops
  }

  // Create periodic bowl strikes
  createBowlStrikes(harmonicNodes) {
    const strikeInterval = setInterval(() => {
      if (!this.currentNodes.has('bowls')) {
        clearInterval(strikeInterval);
        return;
      }

      // Enhance all harmonics briefly for strike effect
      harmonicNodes.forEach(node => {
        if (node.gain) {
          const currentGain = node.gain.gain.value;
          node.gain.gain.setTargetAtTime(currentGain * 3, this.audioContext.currentTime, 0.01);
          node.gain.gain.setTargetAtTime(currentGain, this.audioContext.currentTime + 1, 0.5);
        }
      });

    }, 8000 + Math.random() * 12000); // Occasional strikes
  }

  // Fade in currently playing sound
  fadeIn(duration = 1) {
    this.currentNodes.forEach(nodes => {
      nodes.forEach(node => {
        if (node.gain) {
          const targetVolume = node.gain.gain.value;
          node.gain.gain.value = 0;
          node.gain.gain.setTargetAtTime(targetVolume, this.audioContext.currentTime, duration / 3);
        }
      });
    });
  }

  // Fade out currently playing sound
  fadeOut(duration = 1) {
    this.currentNodes.forEach(nodes => {
      nodes.forEach(node => {
        if (node.gain) {
          node.gain.gain.setTargetAtTime(0, this.audioContext.currentTime, duration / 3);
        }
      });
    });
  }

  // Cleanup - stop all sounds and close context
  cleanup() {
    this.stopAll();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.isInitialized = false;
  }
}

// Create singleton instance
export const audioService = new AudioService();

// Sound type constants
export const SOUND_TYPES = {
  FOREST: 'forest',
  OCEAN: 'ocean', 
  RAIN: 'rain',
  WHITE_NOISE: 'whitenoise',
  SINGING_BOWLS: 'bowls',
  SILENT: 'silent'
};

// Sound configurations with metadata
export const SOUND_CONFIGS = {
  [SOUND_TYPES.FOREST]: {
    name: 'Forest Sounds',
    emoji: '🌲',
    description: 'Birds chirping, wind through trees',
    playFunction: () => audioService.playForestSounds()
  },
  [SOUND_TYPES.OCEAN]: {
    name: 'Ocean Waves',
    emoji: '🌊',
    description: 'Gentle waves on the shore',
    playFunction: () => audioService.playOceanWaves()
  },
  [SOUND_TYPES.RAIN]: {
    name: 'Rain Drops',
    emoji: '🌧️',
    description: 'Soft rainfall and droplets',
    playFunction: () => audioService.playRainSounds()
  },
  [SOUND_TYPES.WHITE_NOISE]: {
    name: 'White Noise',
    emoji: '🔇',
    description: 'Consistent background noise',
    playFunction: () => audioService.playWhiteNoise()
  },
  [SOUND_TYPES.SINGING_BOWLS]: {
    name: 'Singing Bowls',
    emoji: '🎵',
    description: 'Tibetan bowl harmonics',
    playFunction: () => audioService.playSingingBowls()
  },
  [SOUND_TYPES.SILENT]: {
    name: 'Silent',
    emoji: '🔇',
    description: 'No background music',
    playFunction: () => audioService.stopAll()
  }
};
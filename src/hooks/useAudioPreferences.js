import { useState, useEffect } from 'react';
import { SOUND_TYPES } from '../services/audioService';

const AUDIO_PREFERENCES_KEY = 'zenstreak_audio_preferences';

const defaultPreferences = {
  sound: SOUND_TYPES.SILENT,
  volume: 0.3,
  autoStart: true,
  fadeInDuration: 1,
  fadeOutDuration: 1
};

export const useAudioPreferences = () => {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUDIO_PREFERENCES_KEY);
      if (stored) {
        const parsedPreferences = JSON.parse(stored);
        setPreferences(prev => ({ ...prev, ...parsedPreferences }));
      }
    } catch (error) {
      console.warn('Failed to load audio preferences:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(AUDIO_PREFERENCES_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.warn('Failed to save audio preferences:', error);
      }
    }
  }, [preferences, isLoaded]);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updatePreferences = (updates) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
    isLoaded
  };
};
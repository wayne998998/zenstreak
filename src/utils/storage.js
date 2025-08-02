// Local storage utilities for ZenStreak
export const STORAGE_KEYS = {
  STREAK_DATA: 'zenstreak_data',
  USER_PREFERENCES: 'zenstreak_preferences'
};

// Get today's date in YYYY-MM-DD format
export const getTodayString = () => {
  return new Date().toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format
};

// Initialize default data structure
const getDefaultData = () => ({
  currentStreak: 0,
  longestStreak: 0,
  totalSessions: 0,
  checkins: {}, // { 'YYYY-MM-DD': { meditated: true, type: 'mindfulness', duration: 10 } }
  lastCheckIn: null
});

// Load data from localStorage
export const loadStreakData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STREAK_DATA);
    if (!stored) return getDefaultData();
    
    const data = JSON.parse(stored);
    // Ensure all required fields exist
    return {
      ...getDefaultData(),
      ...data
    };
  } catch (error) {
    console.error('Error loading streak data:', error);
    return getDefaultData();
  }
};

// Save data to localStorage
export const saveStreakData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving streak data:', error);
    return false;
  }
};

// Check if user has checked in today
export const hasCheckedInToday = (data) => {
  const today = getTodayString();
  return data.checkins[today]?.meditated === true;
};

// Get the last 7 days for weekly view
export const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toLocaleDateString('en-CA'),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      day: date.getDate()
    });
  }
  return days;
};

// Calculate current streak
export const calculateCurrentStreak = (checkins) => {
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 365; i++) { // Check up to a year back
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateString = checkDate.toLocaleDateString('en-CA');
    
    if (checkins[dateString]?.meditated) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Record a meditation session
export const recordMeditation = (type = 'mindfulness', duration = 5) => {
  const data = loadStreakData();
  const today = getTodayString();
  
  // Don't allow multiple check-ins per day
  if (hasCheckedInToday(data)) {
    return data;
  }
  
  // Record today's session
  data.checkins[today] = {
    meditated: true,
    type,
    duration,
    timestamp: new Date().toISOString()
  };
  
  // Update stats
  data.totalSessions++;
  data.lastCheckIn = today;
  data.currentStreak = calculateCurrentStreak(data.checkins);
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  
  saveStreakData(data);
  return data;
};

// Simple check-in function (alias for recordMeditation with default params)
export const saveCheckIn = () => {
  return recordMeditation('guided-meditation', 5);
};
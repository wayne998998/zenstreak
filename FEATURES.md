# ZenStreak - Meditation Habit Tracker MVP

## Core Features Implemented ✅

### 1. Daily Check-in System
- Simple "Did you meditate today?" prompt
- One-click quick check-in with default mindfulness type
- Detailed meditation type selection (7 categories)
- Prevents multiple check-ins per day

### 2. Streak Counter with Visual Progress
- Dynamic streak circle with color-coded progress
- Emoji indicators based on streak length:
  - 🧘 Starting (0 days)
  - 🌱 Growing (1-6 days)
  - 🌿 Developing (7-29 days)
  - 🌳 Strong (30-99 days)
  - 🏆 Master (100+ days)

### 3. Meditation Type Categories
- **Mindfulness**: Present moment awareness
- **Breathing**: Focus on breath patterns
- **Body Scan**: Progressive muscle relaxation
- **Loving-Kindness**: Compassion and goodwill
- **Walking**: Mindful movement
- **Visualization**: Guided imagery
- **Mantra**: Repetitive sounds or phrases

### 4. Clean Dashboard
- Current streak prominently displayed
- Weekly view showing last 7 days
- Quick stats: Total sessions, longest streak, monthly progress
- Motivational messaging

### 5. Mobile-First Responsive Design
- Optimized for phone screens
- Touch-friendly buttons and interactions
- PWA capabilities with manifest.json
- Smooth animations and transitions

### 6. Local Storage for Offline Functionality
- All data stored locally in browser
- Offline-first approach
- Data persistence across sessions
- Optional data reset functionality

## Technical Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v3
- **Storage**: Browser localStorage
- **PWA**: Service worker + manifest
- **Build**: Vite with optimized production builds

## User Flow

1. **Open App** → See current streak and today's status
2. **Check In** → Quick meditation confirmation or type selection
3. **View Progress** → Weekly view and stats dashboard
4. **Build Habit** → Daily return for streak building

## Data Structure

```javascript
{
  currentStreak: 0,
  longestStreak: 0,
  totalSessions: 0,
  checkins: {
    'YYYY-MM-DD': {
      meditated: true,
      type: 'mindfulness',
      duration: 5,
      timestamp: '2025-08-01T...'
    }
  },
  lastCheckIn: null
}
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview built app
```

## Future Enhancements (Post-MVP)

- Meditation timers and guided sessions
- Achievement badges and milestones
- Social sharing of streaks
- Data export/import
- Reminder notifications
- Analytics and insights
- Multiple habit tracking
# Project Structure

```
zenstreak/
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── BreathingAnimation.jsx
│   │   ├── CheckInButton.jsx
│   │   ├── DailyWisdom.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MeditationSession.jsx
│   │   ├── MusicControls.jsx
│   │   ├── Settings.jsx
│   │   ├── SocialShare.jsx
│   │   ├── Stats.jsx
│   │   ├── StreakCircle.jsx
│   │   ├── WeeklyView.jsx
│   │   └── ...
│   ├── data/                # Static data
│   │   ├── guidedMeditations.js
│   │   └── meditationTypes.js
│   ├── hooks/               # Custom React hooks
│   │   └── useAudioPreferences.js
│   ├── services/            # Service modules
│   │   └── audioService.js
│   ├── utils/               # Utility functions
│   │   └── storage.js
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   ├── sw.js               # Service worker
│   └── vite.svg            # App icon
├── docs/                    # Documentation
│   ├── deployment/          # Deployment guides
│   └── ...
├── scripts/                 # Build and deployment scripts
│   ├── deploy-edgeone.js
│   ├── test-deployed-site.js
│   └── ...
├── examples/                # Example files
│   ├── mock-deploy.html
│   └── upload-helper.html
├── .github/                 # GitHub configuration
│   ├── ISSUE_TEMPLATE/      # Issue templates
│   └── pull_request_template.md
├── dist/                    # Production build (git ignored)
├── node_modules/            # Dependencies (git ignored)
├── package.json             # Project configuration
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── eslint.config.js         # ESLint configuration
├── README.md                # Project documentation
├── LICENSE                  # MIT License
└── CONTRIBUTING.md          # Contribution guidelines
```

## Key Files

### Configuration
- `package.json` - Project metadata and scripts
- `vite.config.js` - Build configuration
- `tailwind.config.js` - Styling configuration

### Core Application
- `src/App.jsx` - Main application component
- `src/components/Dashboard.jsx` - Main dashboard
- `public/sw.js` - Service worker for offline support

### Documentation
- `README.md` - Main project documentation
- `CONTRIBUTING.md` - How to contribute
- `docs/deployment/` - Deployment guides

## Development Workflow

1. Source code in `src/`
2. Build outputs to `dist/`
3. Documentation in `docs/`
4. Scripts in `scripts/`
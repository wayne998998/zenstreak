# 🧘 ZenStreak

<div align="center">
  
  ![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-7.0-646cff?style=flat-square&logo=vite)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=flat-square&logo=tailwindcss)
  ![PWA](https://img.shields.io/badge/PWA-Ready-5a0fc8?style=flat-square&logo=pwa)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
  
  **A beautiful meditation habit tracker that helps you build mindfulness into your daily routine**

  [Live Demo](https://zenstreak.edgeone.site) | [Features](#features) | [Installation](#installation) | [Usage](#usage)

</div>

## ✨ Features

### Core Features
- 🎯 **Daily Check-ins** - Track your meditation practice with a simple tap
- 📊 **Streak Tracking** - Visualize your progress with beautiful streak counters
- 🌬️ **Breathing Animations** - Guided breathing exercises with smooth animations
- 🎵 **Music Integration** - Optional background music for your meditation sessions
- 📱 **PWA Support** - Install as an app, works offline
- 🎉 **Milestone Celebrations** - Celebrate your achievements with confetti animations
- 📤 **Social Sharing** - Share your progress on social media
- 📅 **Weekly View** - See your meditation patterns at a glance

### Technical Features
- ⚡ Lightning fast with Vite
- 🎨 Beautiful UI with Tailwind CSS
- 💾 Local storage for data persistence
- 🔄 Service Worker for offline functionality
- 📱 Fully responsive design
- 🌙 Dark mode ready (coming soon)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/zenstreak.git
cd zenstreak
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5174 in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 PWA Installation

### Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Follow the prompts

### Mobile
1. Open the app in your mobile browser
2. Tap "Add to Home Screen"
3. The app will install and work offline

## 🎯 Usage

### Getting Started
1. Open the app and enter your name
2. Set your meditation goal
3. Start your daily practice

### Daily Practice
1. Tap "Check In Today" to record your meditation
2. Use the breathing animation to guide your practice
3. Optional: Play background music during meditation
4. Track your streak and celebrate milestones

### Features Guide
- **Breathing Exercise**: Follow the expanding/contracting circle
- **Music**: Tap the music icon to toggle background sounds
- **Stats**: View your current streak, total sessions, and best streak
- **Weekly View**: See which days you've meditated this week
- **Share**: Share your achievements on social media

## 🛠️ Development

### Project Structure
```
zenstreak/
├── src/
│   ├── components/     # React components
│   ├── data/          # Static data
│   ├── hooks/         # Custom hooks
│   ├── services/      # Service modules
│   └── utils/         # Utility functions
├── public/            # Static assets
├── dist/             # Production build
└── docs/             # Documentation
```

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Key Technologies
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Service Worker** - Offline support
- **Local Storage** - Data persistence

## 🌐 Deployment

### Deploy to EdgeOne

See [docs/deployment/EDGEONE.md](./docs/deployment/EDGEONE.md) for detailed instructions.

Quick deploy:
```bash
npm run deploy:edgeone
```

### Deploy to Other Platforms

The app can be deployed to any static hosting service:
- Vercel: `vercel --prod`
- Netlify: Deploy the `dist` folder
- GitHub Pages: Use GitHub Actions
- Firebase Hosting: `firebase deploy`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Meditation quotes from various mindfulness teachers
- Icons from Heroicons
- Confetti animation inspired by canvas-confetti
- Built with ❤️ and mindfulness

---

<div align="center">
  Made with 🧘 and ☕
  
  *Find your inner peace, one day at a time* 🌿
</div>
# ZenStreak Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### 2. Netlify
```bash
# Build the app
npm run build

# Deploy to Netlify (install netlify-cli first)
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 3. Static Hosting Services
The app builds to `/dist` folder and can be deployed to any static hosting service:
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront
- DigitalOcean App Platform

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:5174

# Build for production
npm run build

# Preview production build
npm run preview
```

## PWA Features
The app includes:
- Service worker for offline functionality
- App manifest for installation
- Mobile-optimized experience
- Local storage for data persistence

## Environment Variables
No environment variables required - the app runs entirely client-side with local storage.
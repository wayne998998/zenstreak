# Deployment Guide

ZenStreak can be deployed to any static hosting service. Here are guides for popular platforms:

## Quick Deploy Options

### EdgeOne (Tencent Cloud)
- [EdgeOne Deployment Guide](./EDGEONE_DEPLOYMENT.md)
- Fast global CDN
- Built-in HTTPS
- Great for Asia-Pacific region

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
Use GitHub Actions to deploy the `dist` folder automatically.

## Build Process

All deployments require building the project first:

```bash
npm run build
```

This creates a `dist` folder with all static files ready for deployment.

## Environment Requirements

- The app runs entirely client-side
- No server or database required
- All data is stored in browser localStorage
- Service Worker enables offline functionality

## Post-Deployment Testing

After deployment, run tests:

```bash
SITE_URL=https://your-site.com npm run test:deployed
```

## Browser Support

For deployment automation with Playwright:
- [Browser Support Guide](./BROWSER_SUPPORT.md)
- [Browser Mode Guide](./BROWSER_MODE_GUIDE.md)
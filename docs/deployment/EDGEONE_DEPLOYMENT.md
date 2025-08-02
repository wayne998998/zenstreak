# EdgeOne Deployment Guide for ZenStreak

This guide provides instructions for deploying ZenStreak to Tencent Cloud EdgeOne using Playwright automation.

## Prerequisites

1. Node.js 18+ installed
2. A Tencent Cloud account with EdgeOne access
3. Project dependencies installed (`npm install`)

## Installation

First, install the required dependencies:

```bash
npm install
```

This will install Playwright and other necessary packages.

## Deployment Methods

### Method 1: Automated Browser Deployment

This method uses Playwright to automate the browser-based deployment process:

```bash
npm run deploy:edgeone
```

This script will:
1. Build your project automatically
2. Open a browser window
3. Navigate to EdgeOne console
4. Guide you through the login process
5. Create or update your site
6. Upload all files from the `dist` folder

**Note**: You'll need to manually log in to your Tencent Cloud account when prompted.

### Method 2: CLI-Based Deployment Helper

This method creates configuration files and provides CLI commands:

```bash
npm run deploy:edgeone:cli
```

This script will:
1. Build your project
2. Create `edgeone.json` configuration
3. Generate a `deploy.sh` script
4. Open EdgeOne console for manual configuration

After running this, follow these steps:

1. Install EdgeOne CLI (if not already installed):
   ```bash
   npm install -g @tencent/edgeone-cli
   ```

2. Login to EdgeOne:
   ```bash
   edgeone login
   ```

3. Deploy your site:
   ```bash
   ./deploy.sh
   ```

## Manual Deployment

If you prefer manual deployment:

1. Build the project:
   ```bash
   npm run build
   ```

2. Log in to [EdgeOne Console](https://console.cloud.tencent.com/edgeone)

3. Create a new static website:
   - Click "Create Site"
   - Enter site name: `zenstreak`
   - Select "Static Website" as the site type

4. Upload files:
   - Navigate to "File Management"
   - Upload all contents from the `dist` folder
   - Ensure `index.html` is at the root level

5. Configure settings:
   - Enable HTTPS
   - Configure custom domain (optional)
   - Set up caching rules for optimal performance

## Configuration

The deployment scripts automatically configure:
- Static file serving
- Proper headers for PWA functionality
- Service worker caching
- Security headers

## Troubleshooting

1. **Login Issues**: Ensure you have proper permissions in your Tencent Cloud account
2. **Upload Failures**: Check that all files in `dist` are under size limits
3. **Build Errors**: Run `npm run build` manually to see detailed error messages
4. **Browser Automation Issues**: Check `edgeone-error.png` for screenshots of any errors

## Post-Deployment

After successful deployment:
1. Test your site at the provided EdgeOne URL
2. Configure custom domain in EdgeOne console
3. Set up SSL certificates
4. Monitor performance in EdgeOne dashboard

## Support

For EdgeOne-specific issues, refer to [Tencent Cloud documentation](https://cloud.tencent.com/document/product/1552).
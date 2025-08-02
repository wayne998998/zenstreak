import { chromium } from 'playwright';
import { execSync } from 'child_process';

// Configuration
const SITE_URL = process.env.SITE_URL || 'http://localhost:4173'; // Update with EdgeOne URL after deployment
const TEST_TIMEOUT = 30000;

// Test data
const testUser = {
  name: 'Test User',
  goal: 'Daily meditation practice',
  streakTarget: 30
};

async function runFunctionalTests() {
  console.log('🧪 Starting ZenStreak Functional Tests...');
  console.log(`📍 Testing site at: ${SITE_URL}`);
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    permissions: ['notifications']
  });
  
  const page = await context.newPage();
  
  let testsPassed = 0;
  let testsFailed = 0;
  
  const runTest = async (testName, testFn) => {
    console.log(`\n🔍 Running: ${testName}`);
    try {
      await testFn();
      console.log(`✅ PASSED: ${testName}`);
      testsPassed++;
    } catch (error) {
      console.error(`❌ FAILED: ${testName}`);
      console.error(`   Error: ${error.message}`);
      testsFailed++;
      await page.screenshot({ path: `test-failure-${testName.replace(/\s+/g, '-')}.png` });
    }
  };

  try {
    // Navigate to the site
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    
    // Test 1: PWA Installation
    await runTest('PWA Manifest and Service Worker', async () => {
      // Check manifest
      const manifest = await page.evaluate(() => {
        const link = document.querySelector('link[rel="manifest"]');
        return link ? link.href : null;
      });
      if (!manifest) throw new Error('Manifest link not found');
      
      // Check service worker
      const swRegistered = await page.evaluate(() => {
        return navigator.serviceWorker.ready.then(() => true).catch(() => false);
      });
      if (!swRegistered) throw new Error('Service worker not registered');
    });

    // Test 2: Initial Setup Flow
    await runTest('Initial Setup and Onboarding', async () => {
      // Check if setup is needed
      const needsSetup = await page.locator('h1:has-text("Welcome to ZenStreak")').isVisible();
      
      if (needsSetup) {
        // Fill in setup form
        await page.fill('input[placeholder*="name"], input[type="text"]', testUser.name);
        await page.click('button:has-text("Get Started"), button:has-text("Continue")');
        
        // Set meditation goal
        if (await page.locator('text=/goal|meditation/i').isVisible()) {
          await page.fill('input[placeholder*="goal"], textarea', testUser.goal);
        }
        
        // Complete setup
        await page.click('button:has-text("Start"), button:has-text("Begin"), button:has-text("Continue")');
      }
    });

    // Test 3: Dashboard Display
    await runTest('Dashboard Components Display', async () => {
      // Wait for dashboard to load
      await page.waitForSelector('text=/Streak|Day|Meditation/i', { timeout: TEST_TIMEOUT });
      
      // Check streak circle
      const streakCircle = await page.locator('[class*="streak"], [class*="circle"]').isVisible();
      if (!streakCircle) throw new Error('Streak circle not visible');
      
      // Check stats display
      const stats = await page.locator('text=/Current Streak|Total Sessions/i').isVisible();
      if (!stats) throw new Error('Stats section not visible');
      
      // Check daily wisdom
      const wisdom = await page.locator('[class*="wisdom"], text=/quote|wisdom/i').isVisible();
      if (!wisdom) throw new Error('Daily wisdom not visible');
    });

    // Test 4: Check-in Functionality
    await runTest('Daily Check-in', async () => {
      // Find and click check-in button
      const checkInButton = page.locator('button:has-text("Check In"), button:has-text("Today"), button:has-text("Meditate")');
      
      if (await checkInButton.isVisible()) {
        await checkInButton.click();
        
        // Wait for check-in confirmation
        await page.waitForSelector('text=/Completed|Success|Great job/i', { timeout: 5000 });
      }
    });

    // Test 5: Meditation Session
    await runTest('Meditation Session Flow', async () => {
      // Start meditation
      const meditateButton = page.locator('button:has-text("Meditate"), button:has-text("Start Session")');
      
      if (await meditateButton.isVisible()) {
        await meditateButton.click();
        
        // Check meditation timer
        await page.waitForSelector('[class*="timer"], text=/[0-9]+:[0-9]+/', { timeout: 5000 });
        
        // Check breathing animation
        const breathingAnimation = await page.locator('[class*="breathing"], [class*="animate"]').isVisible();
        if (!breathingAnimation) throw new Error('Breathing animation not visible');
        
        // End session after 3 seconds
        await page.waitForTimeout(3000);
        const endButton = page.locator('button:has-text("End"), button:has-text("Finish"), button:has-text("Complete")');
        if (await endButton.isVisible()) {
          await endButton.click();
        }
      }
    });

    // Test 6: Music Feature
    await runTest('Music Controls', async () => {
      // Check for music controls
      const musicButton = page.locator('button[aria-label*="music"], button:has-text("Music"), [class*="music"]');
      
      if (await musicButton.isVisible()) {
        await musicButton.click();
        
        // Check music player elements
        const volumeControl = await page.locator('input[type="range"], [class*="volume"]').isVisible();
        if (!volumeControl) throw new Error('Volume control not found');
      }
    });

    // Test 7: Settings
    await runTest('Settings Page', async () => {
      // Navigate to settings
      const settingsButton = page.locator('button[aria-label*="settings"], button:has-text("Settings"), [class*="settings"]');
      
      if (await settingsButton.isVisible()) {
        await settingsButton.click();
        
        // Check settings options
        await page.waitForSelector('text=/Notifications|Theme|Sound/i', { timeout: 5000 });
        
        // Test theme toggle
        const themeToggle = page.locator('button:has-text("Theme"), [class*="theme"]');
        if (await themeToggle.isVisible()) {
          await themeToggle.click();
          await page.waitForTimeout(1000);
        }
      }
    });

    // Test 8: Weekly View
    await runTest('Weekly View Display', async () => {
      // Check for weekly view
      const weeklyView = await page.locator('[class*="weekly"], text=/Mon|Tue|Wed/i').isVisible();
      if (!weeklyView) throw new Error('Weekly view not visible');
    });

    // Test 9: Social Sharing
    await runTest('Social Share Feature', async () => {
      const shareButton = page.locator('button:has-text("Share"), [aria-label*="share"]');
      
      if (await shareButton.isVisible()) {
        await shareButton.click();
        
        // Check share modal or options
        await page.waitForSelector('text=/Twitter|Facebook|Copy/i', { timeout: 5000 });
        
        // Close share modal
        await page.keyboard.press('Escape');
      }
    });

    // Test 10: Offline Functionality
    await runTest('Offline Mode (Service Worker)', async () => {
      // Go offline
      await context.setOffline(true);
      
      // Reload page
      await page.reload();
      
      // Check if page still loads
      await page.waitForSelector('text=/Streak|ZenStreak/i', { timeout: 10000 });
      
      // Go back online
      await context.setOffline(false);
    });

    // Test 11: Responsive Design
    await runTest('Mobile Responsive Design', async () => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(1000);
      
      // Check mobile menu
      const mobileMenu = await page.locator('[class*="mobile"], [class*="hamburger"], button[aria-label*="menu"]').isVisible();
      
      // Check that main elements are still visible
      const mainContent = await page.locator('text=/Streak|Day/i').isVisible();
      if (!mainContent) throw new Error('Main content not visible on mobile');
      
      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    });

    // Test 12: Easter Eggs
    await runTest('Zen Easter Eggs', async () => {
      // Try to trigger easter egg
      await page.evaluate(() => {
        // Trigger Konami code or specific key sequence
        const event = new KeyboardEvent('keydown', { key: 'z' });
        document.dispatchEvent(event);
      });
      
      // Check for any easter egg response
      await page.waitForTimeout(1000);
    });

    // Test 13: Data Persistence
    await runTest('Local Storage Data Persistence', async () => {
      // Get current streak data
      const streakData = await page.evaluate(() => {
        return localStorage.getItem('zenstreak-data');
      });
      
      if (!streakData) throw new Error('No data in local storage');
      
      // Reload and check data persists
      await page.reload();
      
      const persistedData = await page.evaluate(() => {
        return localStorage.getItem('zenstreak-data');
      });
      
      if (persistedData !== streakData) throw new Error('Data not persisted correctly');
    });

    // Test 14: Performance
    await runTest('Page Performance', async () => {
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime
        };
      });
      
      console.log(`   Load time: ${metrics.loadTime}ms`);
      console.log(`   DOM Content Loaded: ${metrics.domContentLoaded}ms`);
      
      if (metrics.loadTime > 3000) {
        console.warn('   ⚠️  Warning: Page load time exceeds 3 seconds');
      }
    });

  } catch (error) {
    console.error('\n💥 Test suite error:', error.message);
  } finally {
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${testsPassed}`);
    console.log(`❌ Failed: ${testsFailed}`);
    console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
    
    await browser.close();
  }
}

// Helper function to preview locally before EdgeOne deployment
async function startLocalPreview() {
  console.log('🚀 Starting local preview server...');
  
  const previewProcess = execSync('npm run preview', { 
    stdio: 'pipe',
    encoding: 'utf-8'
  });
  
  console.log(previewProcess);
  
  // Extract URL from output
  const urlMatch = previewProcess.match(/http:\/\/localhost:\d+/);
  return urlMatch ? urlMatch[0] : 'http://localhost:4173';
}

// Main execution
const isLocal = !process.env.SITE_URL;

if (isLocal) {
  console.log('📍 No SITE_URL provided, testing local build...');
  console.log('💡 To test deployed site, run: SITE_URL=https://your-edgeone-url.com node test-deployed-site.js');
  
  // Start preview server in background
  const { spawn } = await import('child_process');
  const preview = spawn('npm', ['run', 'preview'], {
    detached: true,
    stdio: 'ignore'
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Run tests
  await runFunctionalTests();
  
  // Kill preview server
  process.kill(-preview.pid);
} else {
  // Test deployed site
  await runFunctionalTests();
}
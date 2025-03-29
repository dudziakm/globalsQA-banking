import { defineConfig, devices } from '@playwright/test';
import { getEnvironmentConfig, isCIEnvironment } from './src/config/environments';

const envConfig = getEnvironmentConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: isCIEnvironment,
  forbidOnly: isCIEnvironment,
  retries: envConfig.retries,
  workers: isCIEnvironment ? 2 : 1,
  reporter: [
    ['html'],
    ['list']
  ],
  timeout: envConfig.timeout,
  use: {
    baseURL: envConfig.baseUrl,
    trace: isCIEnvironment ? 'on-first-retry' : 'on',
    screenshot: 'only-on-failure',
    video: isCIEnvironment ? 'on-first-retry' : 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: isCIEnvironment ? 0 : 50,
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },
  ],
}); 
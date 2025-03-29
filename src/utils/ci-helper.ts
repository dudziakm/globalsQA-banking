import { Page } from '@playwright/test';
import { isCIEnvironment } from '../config/environments';

/**
 * Helper utilities for CI environments
 */
export class CIHelper {
  /**
   * Determines if we're running in a CI environment
   */
  static isRunningInCI(): boolean {
    return isCIEnvironment;
  }

  /**
   * Configure CI-specific page settings
   * @param page Playwright page object
   */
  static async configurePage(page: Page): Promise<void> {
    if (!this.isRunningInCI()) return;

    // Set CI-specific headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
  }
  
  /**
   * Add stability delay - only used in special cases where we need to wait
   * @param page Playwright page
   * @param ms Milliseconds to wait
   */
  static async stabilityDelay(page: Page, ms: number = 500): Promise<void> {
    if (this.isRunningInCI()) {
      // We don't need extra delays in CI as we have proper waiting mechanisms
      return;
    }
    await page.waitForTimeout(ms);
  }
} 
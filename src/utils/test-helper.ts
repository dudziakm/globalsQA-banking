import { Page } from '@playwright/test';

/**
 * Helper class with common utility methods for test automation
 */
export class TestHelper {
  /**
   * Waits for page navigation and handles any alerts or popups
   * @param page Playwright page instance
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Takes a screenshot with a custom filename
   * @param page Playwright page instance
   * @param fileName Name of the screenshot file
   */
  static async takeScreenshot(page: Page, fileName: string): Promise<void> {
    await page.screenshot({ path: `./screenshots/${fileName}.png`, fullPage: true });
  }

  /**
   * Generates a random string that can be used for test data
   * @param length Length of the random string
   * @returns Random string
   */
  static generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generates a random number within a range
   * @param min Minimum value
   * @param max Maximum value
   * @returns Random number
   */
  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
} 
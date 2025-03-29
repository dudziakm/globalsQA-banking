import { Page, Locator, expect } from '@playwright/test';
import { getEnvironmentConfig } from '../config/environments';

/**
 * Base page class that all page objects will extend
 * Contains common methods used across different pages
 */
export class BasePage {
  protected baseUrl: string;

  constructor(protected page: Page) {
    this.baseUrl = getEnvironmentConfig().baseUrl;
  }

  /**
   * Navigate to a specific path relative to base URL
   * @param path Path to navigate to (optional)
   */
  async navigate(path: string = ''): Promise<void> {
    const url = `${this.baseUrl}${path}`;
    console.log(`Navigating to: ${url}`);
    
    // Try navigation with retries
    let retries = 2;
    while (retries >= 0) {
      try {
        await this.page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
        await this.handleCookieConsent();
        
        // Check if we have the expected content
        const mainElements = await this.page.locator('button:has-text("Customer Login")').count();
        if (mainElements > 0) {
          return;
        }
        
        if (retries > 0) {
          console.log(`Page load attempt failed, retrying... (${retries} attempts left)`);
          await this.page.waitForTimeout(1000);
        }
        retries--;
      } catch (e) {
        console.error('Navigation error:', e);
        if (retries > 0) {
          console.log(`Navigation failed, retrying... (${retries} attempts left)`);
          await this.page.waitForTimeout(1000);
        }
        retries--;
      }
    }
    
    throw new Error(`Could not load the page: ${url}`);
  }

  /**
   * Handle cookie consent popup if it appears
   */
  async handleCookieConsent(): Promise<void> {
    // Try to locate common cookie consent elements
    const acceptButton = this.page.locator('button:has-text("Accept"), button:has-text("Accept All"), button:has-text("OK"), .cookie-consent button, #cookie-accept, #accept-cookies');
    
    // Check if the popup is visible and click the accept button
    if (await acceptButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await acceptButton.click().catch(() => console.log('Could not click accept button'));
    }
  }

  /**
   * Wait for an element to be visible
   * @param locator Element locator
   * @param timeout Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    // Playwright automatically waits for elements in most action methods like click()
    // This method is only needed for explicit waits in special cases
    await locator.waitFor({ 
      state: 'visible', 
      timeout: timeout || getEnvironmentConfig().timeout 
    });
  }

  /**
   * Click on an element
   * @param locator Element locator
   */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Fill a form field with text
   * @param locator Element locator
   * @param text Text to enter
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Get text from an element
   * @param locator Element locator
   * @returns Text content of the element
   */
  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  /**
   * Check if element is visible
   * @param locator Element locator
   * @returns True if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Assert that an element contains specific text
   * @param locator Element locator
   * @param text Expected text
   */
  async expectTextToContain(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  /**
   * Get the current page URL
   * @returns Current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
} 
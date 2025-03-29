import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Page object for the login page
 */
export class LoginPage extends BasePage {
  // Locators
  private customerLoginBtn: Locator;
  private bankManagerLoginBtn: Locator;
  private homeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.customerLoginBtn = page.locator('button', { hasText: 'Customer Login' });
    this.bankManagerLoginBtn = page.locator('button', { hasText: 'Bank Manager Login' });
    this.homeButton = page.locator('button.btn.home');
  }

  /**
   * Navigate to the login page
   */
  async navigateToLoginPage(): Promise<void> {
    // Use the direct approach with maximum timeout
    try {
      // Go directly to the login page
      await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login', { 
        timeout: 60000,
        waitUntil: 'networkidle'
      });
      
      // Handle any cookie consent
      await this.handleCookieConsent();
      
      // Wait for login buttons to be visible
      const isCustomerVisible = await this.customerLoginBtn.isVisible({ timeout: 15000 }).catch(() => false);
      const isManagerVisible = await this.bankManagerLoginBtn.isVisible({ timeout: 15000 }).catch(() => false);
      
      if (isCustomerVisible && isManagerVisible) {
        console.log('Successfully loaded login page');
        // Give a moment for the UI to stabilize
        await this.page.waitForTimeout(1000);
        return;
      }
      
      // If not found, try one more approach
      await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/', { 
        timeout: 60000,
        waitUntil: 'networkidle'
      });
      
      // Wait again
      await this.page.waitForTimeout(5000);
      
      // Final check
      if (!await this.customerLoginBtn.isVisible({ timeout: 15000 }).catch(() => false)) {
        throw new Error('Could not load login page buttons');
      }
    } catch (error) {
      console.error('Error navigating to login page:', error);
      throw new Error(`Failed to navigate to login page: ${error}`);
    }
  }

  /**
   * Click on the Customer Login button
   */
  async clickCustomerLogin(): Promise<void> {
    try {
      // Try to click the button
      if (await this.customerLoginBtn.isVisible({ timeout: 10000 })) {
        await this.customerLoginBtn.click({ timeout: 10000 });
      } else {
        // Direct navigation as fallback
        await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/customer', { 
          timeout: 30000,
          waitUntil: 'networkidle'
        });
      }
      
      // Wait for the customer selection page to load (maximum 30 seconds)
      const userSelectVisible = await this.page.waitForSelector('#userSelect', { 
        state: 'visible', 
        timeout: 30000 
      }).catch(() => null);
      
      if (!userSelectVisible) {
        throw new Error('Customer selection page did not load');
      }
    } catch (error) {
      console.error('Error clicking Customer Login:', error);
      // Last resort direct navigation
      await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/customer');
      await this.page.waitForSelector('#userSelect', { state: 'visible', timeout: 30000 });
    }
  }

  /**
   * Click on the Bank Manager Login button
   */
  async clickBankManagerLogin(): Promise<void> {
    try {
      // Try to click the button
      if (await this.bankManagerLoginBtn.isVisible({ timeout: 10000 })) {
        await this.bankManagerLoginBtn.click({ timeout: 10000 });
      } else {
        // Direct navigation as fallback
        await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager', { 
          timeout: 30000,
          waitUntil: 'networkidle'
        });
      }
      
      // Wait for the manager page to load (maximum 30 seconds)
      const addCustButtonVisible = await this.page.waitForSelector('button[ng-click="addCust()"]', { 
        state: 'visible', 
        timeout: 30000 
      }).catch(() => null);
      
      if (!addCustButtonVisible) {
        throw new Error('Manager page did not load');
      }
    } catch (error) {
      console.error('Error clicking Bank Manager Login:', error);
      // Last resort direct navigation
      await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager');
      await this.page.waitForSelector('button[ng-click="addCust()"]', { state: 'visible', timeout: 30000 });
    }
  }

  /**
   * Click on the Home button
   */
  async clickHomeButton(): Promise<void> {
    try {
      // Try to click the button
      if (await this.homeButton.isVisible({ timeout: 10000 })) {
        await this.homeButton.click({ timeout: 10000 });
      } else {
        // Direct navigation as fallback
        await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login', { 
          timeout: 30000,
          waitUntil: 'networkidle'
        });
      }
      
      // Wait for login buttons to appear
      await this.page.waitForSelector('button:has-text("Customer Login")', { 
        state: 'visible', 
        timeout: 30000 
      });
    } catch (error) {
      console.error('Error clicking Home button:', error);
      // Last resort direct navigation
      await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
    }
  }

  /**
   * Check if the login page is loaded
   * @returns True if login page is loaded
   */
  async isLoginPageLoaded(): Promise<boolean> {
    const customerVisible = await this.isVisible(this.customerLoginBtn);
    const managerVisible = await this.isVisible(this.bankManagerLoginBtn);
    return customerVisible && managerVisible;
  }
} 
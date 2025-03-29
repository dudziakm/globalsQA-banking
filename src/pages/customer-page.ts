import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Page object for the customer selection and account pages
 */
export class CustomerPage extends BasePage {
  // Locators
  private customerDropdown: Locator;
  private loginButton: Locator;
  private welcomeMessage: Locator;
  private accountSelect: Locator;
  private transactionsButton: Locator;
  private depositButton: Locator;
  private withdrawlButton: Locator;
  private amountInput: Locator;
  private depositSubmitButton: Locator;
  private withdrawSubmitButton: Locator;
  private transactionMessage: Locator;
  private accountBalance: Locator;
  private logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.customerDropdown = page.locator('#userSelect');
    this.loginButton = page.locator('button', { hasText: 'Login' });
    this.welcomeMessage = page.locator('span.fontBig');
    this.accountSelect = page.locator('#accountSelect');
    this.transactionsButton = page.locator('button[ng-click="transactions()"]');
    this.depositButton = page.locator('button[ng-click="deposit()"]');
    this.withdrawlButton = page.locator('button[ng-click="withdrawl()"]');
    this.amountInput = page.locator('input[ng-model="amount"]');
    this.depositSubmitButton = page.locator('button[type="submit"]', { hasText: 'Deposit' });
    this.withdrawSubmitButton = page.locator('button[type="submit"]', { hasText: 'Withdraw' });
    this.transactionMessage = page.locator('span.error');
    this.accountBalance = page.locator('div.center strong.ng-binding:nth-child(2)');
    this.logoutButton = page.locator('button.btn-primary', { hasText: 'Logout' });
  }

  /**
   * Select a customer from the dropdown
   * @param customerName Customer name to select
   */
  async selectCustomer(customerName: string): Promise<void> {
    await this.waitForElement(this.customerDropdown);
    await this.customerDropdown.selectOption({ label: customerName });
  }

  /**
   * Click the login button
   */
  async clickLogin(): Promise<void> {
    await this.waitForElement(this.loginButton);
    await this.click(this.loginButton);
    // Wait for account page to load
    await this.waitForElement(this.welcomeMessage);
  }

  /**
   * Get the welcome message text
   * @returns Welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    await this.waitForElement(this.welcomeMessage);
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Select an account from the dropdown
   * @param accountNumber Account number to select
   */
  async selectAccount(accountNumber: string): Promise<void> {
    await this.waitForElement(this.accountSelect);
    await this.accountSelect.selectOption({ label: accountNumber });
  }

  /**
   * Click the deposit button to show deposit form
   */
  async clickDepositTab(): Promise<void> {
    await this.waitForElement(this.depositButton);
    await this.click(this.depositButton);
    // Wait for deposit form to be visible
    await this.waitForElement(this.amountInput);
    await this.waitForElement(this.depositSubmitButton);
  }

  /**
   * Click the withdraw button to show withdraw form
   */
  async clickWithdrawTab(): Promise<void> {
    await this.waitForElement(this.withdrawlButton);
    await this.click(this.withdrawlButton);
    // Wait for withdraw form to be visible
    await this.waitForElement(this.amountInput);
    await this.waitForElement(this.withdrawSubmitButton);
  }

  /**
   * Enter an amount in the amount input field
   * @param amount Amount to enter
   */
  async enterAmount(amount: string): Promise<void> {
    await this.waitForElement(this.amountInput);
    await this.fill(this.amountInput, amount);
  }

  /**
   * Click the deposit submit button
   */
  async submitDeposit(): Promise<void> {
    await this.waitForElement(this.depositSubmitButton);
    await this.click(this.depositSubmitButton);
    // Wait for transaction message to appear
    await this.waitForElement(this.transactionMessage);
  }

  /**
   * Click the withdraw submit button
   */
  async submitWithdraw(): Promise<void> {
    await this.waitForElement(this.withdrawSubmitButton);
    await this.click(this.withdrawSubmitButton);
    // Wait for transaction message to appear
    await this.waitForElement(this.transactionMessage);
  }

  /**
   * Get the transaction status message
   * @returns Transaction status message
   */
  async getTransactionMessage(): Promise<string> {
    await this.waitForElement(this.transactionMessage);
    return await this.getText(this.transactionMessage);
  }

  /**
   * Get the account balance
   * @returns Account balance
   */
  async getAccountBalance(): Promise<string> {
    await this.waitForElement(this.accountBalance);
    return await this.getText(this.accountBalance);
  }

  /**
   * Perform a deposit operation
   * @param amount Amount to deposit
   */
  async makeDeposit(amount: string): Promise<void> {
    await this.clickDepositTab();
    await this.enterAmount(amount);
    await this.submitDeposit();
    // Wait a moment for the transaction to process
    await this.page.waitForTimeout(500);
  }

  /**
   * Perform a withdrawal operation
   * @param amount Amount to withdraw
   */
  async makeWithdrawal(amount: string): Promise<void> {
    await this.clickWithdrawTab();
    await this.enterAmount(amount);
    await this.submitWithdraw();
    // Wait a moment for the transaction to process
    await this.page.waitForTimeout(500);
  }

  /**
   * Click the logout button
   */
  async logout(): Promise<void> {
    try {
      // Try to find and click the logout button
      const isVisible = await this.logoutButton.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isVisible) {
        await this.logoutButton.click({ timeout: 15000 });
      } else {
        // If logout button is not found, try a more general selector
        const alternativeLogoutButton = this.page.locator('button', { hasText: 'Logout' });
        await alternativeLogoutButton.click({ timeout: 10000 });
      }
      
      // Wait for customer dropdown to appear, confirming logout
      await this.page.waitForSelector('#userSelect', { state: 'visible', timeout: 20000 });
    } catch (error) {
      console.error('Error clicking logout button:', error);
      
      // As a fallback, navigate directly to customer selection page
      await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/customer', { 
        timeout: 30000,
        waitUntil: 'networkidle' 
      });
      
      // Wait for the customer selection dropdown to be visible
      await this.page.waitForSelector('#userSelect', { state: 'visible', timeout: 20000 });
    }
  }

  /**
   * Click the transactions button
   */
  async clickTransactionsButton(): Promise<void> {
    await this.waitForElement(this.transactionsButton);
    await this.click(this.transactionsButton);
    // Wait for transactions page to load
    await this.page.waitForSelector('button[ng-click="back()"]', { state: 'visible' });
  }
} 
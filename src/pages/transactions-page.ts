import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Page object for the Transactions page
 */
export class TransactionsPage extends BasePage {
  // Locators
  private transactionsTable: Locator;
  private transactionRows: Locator;
  private backButton: Locator;
  private resetButton: Locator;
  private dateFromInput: Locator;
  private dateToInput: Locator;

  constructor(page: Page) {
    super(page);
    this.transactionsTable = page.locator('table.table');
    this.transactionRows = page.locator('table.table tbody tr');
    this.backButton = page.locator('button[ng-click="back()"]');
    this.resetButton = page.locator('button[ng-click="reset()"]');
    this.dateFromInput = page.locator('input#start');
    this.dateToInput = page.locator('input#end');
  }

  /**
   * Get the number of transactions in the table
   * @returns Number of transactions
   */
  async getTransactionCount(): Promise<number> {
    await this.waitForElement(this.transactionsTable);
    return await this.transactionRows.count();
  }

  /**
   * Get transaction details by index
   * @param index Index of the transaction (0-based)
   * @returns Transaction details object or null if not found
   */
  async getTransactionDetails(index: number): Promise<{ date: string; amount: string; type: string } | null> {
    await this.waitForElement(this.transactionsTable);
    const rows = await this.transactionRows.all();
    if (index < rows.length) {
      const columns = await rows[index].locator('td').all();
      if (columns.length >= 3) {
        return {
          date: await columns[0].textContent() || '',
          amount: await columns[1].textContent() || '',
          type: await columns[2].textContent() || ''
        };
      }
    }
    return null;
  }

  /**
   * Click the back button to return to the account page
   */
  async clickBackButton(): Promise<void> {
    await this.waitForElement(this.backButton);
    await this.click(this.backButton);
    // Wait for the account page to load
    await this.page.waitForSelector('button[ng-click="deposit()"]', { state: 'visible' });
  }

  /**
   * Click the reset button to clear transaction filters
   */
  async clickResetButton(): Promise<void> {
    await this.waitForElement(this.resetButton);
    await this.click(this.resetButton);
    // Wait for reset to complete
    await this.page.waitForTimeout(500);
  }

  /**
   * Filter transactions by date range
   * @param fromDate From date in yyyy-mm-dd format
   * @param toDate To date in yyyy-mm-dd format
   */
  async filterByDateRange(fromDate: string, toDate: string): Promise<void> {
    await this.waitForElement(this.dateFromInput);
    await this.waitForElement(this.dateToInput);
    await this.fill(this.dateFromInput, fromDate);
    await this.fill(this.dateToInput, toDate);
    // Wait for filter to apply
    await this.page.waitForTimeout(500);
  }

  /**
   * Check if transaction table is visible
   * @returns True if transaction table is visible
   */
  async isTransactionTableVisible(): Promise<boolean> {
    return await this.isVisible(this.transactionsTable);
  }
} 
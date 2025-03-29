import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { TestHelper } from '../utils/test-helper';

/**
 * Page object for the Bank Manager pages
 */
export class ManagerPage extends BasePage {
  // Locators
  private addCustomerButton: Locator;
  private openAccountButton: Locator;
  private customersButton: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private postCodeInput: Locator;
  private addCustomerSubmitButton: Locator;
  private customerDropdown: Locator;
  private currencyDropdown: Locator;
  private processButton: Locator;
  private searchCustomerInput: Locator;
  private customerRows: Locator;
  private deleteButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.addCustomerButton = page.locator('button[ng-click="addCust()"]');
    this.openAccountButton = page.locator('button[ng-click="openAccount()"]');
    this.customersButton = page.locator('button[ng-click="showCust()"]');
    this.firstNameInput = page.locator('input[ng-model="fName"]');
    this.lastNameInput = page.locator('input[ng-model="lName"]');
    this.postCodeInput = page.locator('input[ng-model="postCd"]');
    this.addCustomerSubmitButton = page.locator('button[type="submit"]');
    this.customerDropdown = page.locator('#userSelect');
    this.currencyDropdown = page.locator('#currency');
    this.processButton = page.locator('button[type="submit"]');
    this.searchCustomerInput = page.locator('input[ng-model="searchCustomer"]');
    this.customerRows = page.locator('table.table tbody tr');
    this.deleteButtons = page.locator('button[ng-click="deleteCust(cust)"]');
  }

  /**
   * Click the 'Add Customer' tab
   */
  async navigateToAddCustomer(): Promise<void> {
    await this.click(this.addCustomerButton);
  }

  /**
   * Click the 'Open Account' tab
   */
  async navigateToOpenAccount(): Promise<void> {
    await this.click(this.openAccountButton);
  }

  /**
   * Click the 'Customers' tab
   */
  async navigateToCustomers(): Promise<void> {
    await this.click(this.customersButton);
  }

  /**
   * Fill customer details form
   * @param firstName Customer's first name
   * @param lastName Customer's last name
   * @param postCode Customer's post code
   */
  async fillCustomerDetails(firstName: string, lastName: string, postCode: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postCodeInput, postCode);
  }

  /**
   * Submit the add customer form
   */
  async submitAddCustomer(): Promise<void> {
    await this.click(this.addCustomerSubmitButton);
  }

  /**
   * Add a new customer
   * @param firstName Customer's first name
   * @param lastName Customer's last name
   * @param postCode Customer's post code
   * @returns Alert message text
   */
  async addNewCustomer(firstName: string, lastName: string, postCode: string): Promise<string> {
    await this.navigateToAddCustomer();
    await this.fillCustomerDetails(firstName, lastName, postCode);
    
    // Set up dialog handler before triggering the action
    let alertMessage = '';
    this.page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    await this.submitAddCustomer();
    
    // Wait a moment for the dialog to be processed
    await this.page.waitForTimeout(1000);
    
    return alertMessage;
  }

  /**
   * Select a customer from the dropdown
   * @param customerName Customer name to select
   */
  async selectCustomer(customerName: string): Promise<void> {
    await this.customerDropdown.selectOption({ label: customerName });
  }

  /**
   * Select a currency from the dropdown
   * @param currency Currency to select
   */
  async selectCurrency(currency: string): Promise<void> {
    await this.currencyDropdown.selectOption({ value: currency });
  }

  /**
   * Click the process button to create an account
   */
  async clickProcessButton(): Promise<void> {
    await this.click(this.processButton);
  }

  /**
   * Open an account for a customer
   * @param customerName Customer name
   * @param currency Currency
   * @returns Alert message text
   */
  async openAccount(customerName: string, currency: string): Promise<string> {
    await this.navigateToOpenAccount();
    await this.selectCustomer(customerName);
    await this.selectCurrency(currency);
    
    // Set up dialog handler before triggering the action
    let alertMessage = '';
    this.page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    await this.clickProcessButton();
    
    // Wait a moment for the dialog to be processed
    await this.page.waitForTimeout(1000);
    
    return alertMessage;
  }

  /**
   * Search for a customer
   * @param searchText Text to search for
   */
  async searchCustomer(searchText: string): Promise<void> {
    await this.navigateToCustomers();
    await this.fill(this.searchCustomerInput, searchText);
  }

  /**
   * Get the number of customers in the table
   * @returns Number of customers
   */
  async getCustomerCount(): Promise<number> {
    return await this.customerRows.count();
  }

  /**
   * Delete a customer by index
   * @param index Index of the customer to delete (0-based)
   */
  async deleteCustomer(index: number): Promise<void> {
    const deleteButtons = await this.deleteButtons.all();
    if (index < deleteButtons.length) {
      await deleteButtons[index].click();
    }
  }

  /**
   * Generate random customer data
   * @returns Object with firstName, lastName, and postCode
   */
  generateRandomCustomer(): { firstName: string; lastName: string; postCode: string } {
    return {
      firstName: `John${TestHelper.generateRandomString(5)}`,
      lastName: `Doe${TestHelper.generateRandomString(5)}`,
      postCode: `E${TestHelper.generateRandomNumber(10000, 99999)}`
    };
  }
} 
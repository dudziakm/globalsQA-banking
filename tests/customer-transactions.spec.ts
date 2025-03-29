import { test, expect } from '@playwright/test';
import { LoginPage, CustomerPage, TransactionsPage } from '../src/pages';
import { BankTestData } from '../src/data/test-data';

test.describe('Customer Transaction Functionality', () => {
  // Use a test fixture to perform login before each test
  test.beforeEach(async ({ page }) => {
    // Set a moderate timeout
    await page.context().setDefaultTimeout(30000);
    
    const loginPage = new LoginPage(page);
    const customerPage = new CustomerPage(page);
    const customerName = BankTestData.existingCustomers[0]; // Hermoine Granger
    
    try {
      // Navigate to login page and perform customer login
      await loginPage.navigateToLoginPage();
      await loginPage.clickCustomerLogin();
      await customerPage.selectCustomer(customerName);
      await customerPage.clickLogin();
      
      // Wait for the account page to stabilize
      await page.waitForTimeout(1000);
    } catch (error) {
      console.error('Setup failed:', error);
      // Take a screenshot to help debug
      await page.screenshot({ path: 'setup-failure.png' });
      throw error;
    }
  });

  test('should successfully deposit amount into account', async ({ page }) => {
    // Arrange
    const customerPage = new CustomerPage(page);
    const depositAmount = BankTestData.depositAmount;
    
    try {
      // Get initial balance
      const initialBalanceText = await customerPage.getAccountBalance();
      const initialBalance = Number(initialBalanceText);
      
      // Act - Perform deposit
      await customerPage.makeDeposit(depositAmount);
      
      // Wait for transaction to complete
      await page.waitForTimeout(1000);
      
      // Assert
      const message = await customerPage.getTransactionMessage();
      expect(message).toContain(BankTestData.depositSuccessMessage);
      
      // Verify balance has increased
      const newBalanceText = await customerPage.getAccountBalance();
      const newBalance = Number(newBalanceText);
      
      // Check if balance has increased by at least the deposit amount
      // We allow for the possibility that there might be previous transactions
      expect(newBalance).toBeGreaterThanOrEqual(initialBalance + Number(depositAmount));
    } catch (error) {
      console.error('Deposit test failed:', error);
      await page.screenshot({ path: 'deposit-failure.png' });
      throw error;
    }
  });

  test('should successfully withdraw amount from account', async ({ page }) => {
    // Arrange
    const customerPage = new CustomerPage(page);
    const depositAmount = BankTestData.depositAmount;
    const withdrawAmount = BankTestData.withdrawAmount;
    
    try {
      // First deposit some money
      await customerPage.makeDeposit(depositAmount);
      
      // Wait for transaction to complete
      await page.waitForTimeout(1000);
      
      // Get balance after deposit
      const balanceAfterDepositText = await customerPage.getAccountBalance();
      const balanceAfterDeposit = Number(balanceAfterDepositText);
      
      // Act - Perform withdrawal
      await customerPage.makeWithdrawal(withdrawAmount);
      
      // Wait for transaction to complete
      await page.waitForTimeout(1000);
      
      // Assert
      const message = await customerPage.getTransactionMessage();
      expect(message).toContain(BankTestData.withdrawSuccessMessage);
      
      // Verify balance has decreased
      const balanceAfterWithdrawText = await customerPage.getAccountBalance();
      const balanceAfterWithdraw = Number(balanceAfterWithdrawText);
      
      // Check if balance has decreased by the withdrawal amount
      expect(balanceAfterWithdraw).toBeLessThan(balanceAfterDeposit);
      expect(balanceAfterDeposit - balanceAfterWithdraw).toBeCloseTo(Number(withdrawAmount), 0);
    } catch (error) {
      console.error('Withdrawal test failed:', error);
      await page.screenshot({ path: 'withdrawal-failure.png' });
      throw error;
    }
  });

  test('should show error when withdrawing more than balance', async ({ page }) => {
    // Arrange
    const customerPage = new CustomerPage(page);
    const invalidAmount = BankTestData.invalidWithdrawAmount;
    
    try {
      // Act - Try to withdraw an invalid amount
      await customerPage.makeWithdrawal(invalidAmount);
      
      // Wait for error message to appear
      await page.waitForTimeout(1000);
      
      // Assert
      const message = await customerPage.getTransactionMessage();
      expect(message).toContain(BankTestData.withdrawErrorMessage);
    } catch (error) {
      console.error('Invalid withdrawal test failed:', error);
      await page.screenshot({ path: 'invalid-withdrawal-failure.png' });
      throw error;
    }
  });

  test('should show transaction history', async ({ page }) => {
    // Arrange
    const customerPage = new CustomerPage(page);
    const transactionsPage = new TransactionsPage(page);
    const depositAmount = BankTestData.depositAmount;
    
    try {
      // First deposit some money to create a transaction
      await customerPage.makeDeposit(depositAmount);
      
      // Wait for transaction to complete
      await page.waitForTimeout(1000);
      
      // Act - Navigate to transactions page
      await customerPage.clickTransactionsButton();
      
      // Wait for transactions page to load
      await page.waitForTimeout(1000);
      
      // Assert
      expect(await transactionsPage.isTransactionTableVisible()).toBeTruthy();
      
      // Verify at least one transaction is shown
      const transactionCount = await transactionsPage.getTransactionCount();
      expect(transactionCount).toBeGreaterThan(0);
      
      // Return to account page
      await transactionsPage.clickBackButton();
    } catch (error) {
      console.error('Transaction history test failed:', error);
      await page.screenshot({ path: 'transaction-history-failure.png' });
      throw error;
    }
  });
}); 
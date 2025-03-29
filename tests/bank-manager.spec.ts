import { test, expect } from '@playwright/test';
import { LoginPage, ManagerPage } from '../src/pages';
import { BankTestData } from '../src/data/test-data';
import { TestHelper } from '../src/utils/test-helper';

test.describe('Bank Manager Functionality', () => {
  // Use a test fixture to navigate to manager page before each test
  test.beforeEach(async ({ page }) => {
    // Set a moderate timeout
    await page.context().setDefaultTimeout(30000);
    
    const loginPage = new LoginPage(page);
    
    try {
      // Navigate to login page and click on Bank Manager Login
      await loginPage.navigateToLoginPage();
      await loginPage.clickBankManagerLogin();
      
      // Wait for manager page to stabilize
      await page.waitForTimeout(1000);
    } catch (error) {
      console.error('Manager setup failed:', error);
      await page.screenshot({ path: 'manager-setup-failure.png' });
      throw error;
    }
  });

  test('should add a new customer successfully', async ({ page }) => {
    // Arrange
    const managerPage = new ManagerPage(page);
    const newCustomerData = managerPage.generateRandomCustomer();
    
    try {
      // Act - Add a new customer
      const alertMessage = await managerPage.addNewCustomer(
        newCustomerData.firstName,
        newCustomerData.lastName,
        newCustomerData.postCode
      );
      
      // Assert
      expect(alertMessage).toContain('Customer added successfully');
      
      // Wait for UI to update
      await page.waitForTimeout(1000);
      
      // Verify customer is in the list
      await managerPage.navigateToCustomers();
      await managerPage.searchCustomer(newCustomerData.firstName);
      
      // Wait for search to complete
      await page.waitForTimeout(1000);
      
      // Should find at least one matching customer
      const customerCount = await managerPage.getCustomerCount();
      expect(customerCount).toBeGreaterThan(0);
    } catch (error) {
      console.error('Add customer test failed:', error);
      await page.screenshot({ path: 'add-customer-failure.png' });
      throw error;
    }
  });

  test('should open account for existing customer', async ({ page }) => {
    // Arrange
    const managerPage = new ManagerPage(page);
    const customerName = BankTestData.existingCustomers[0];
    const currency = BankTestData.currencies[0];
    
    try {
      // Act - Open a new account
      const alertMessage = await managerPage.openAccount(customerName, currency);
      
      // Assert
      expect(alertMessage).toContain('Account created successfully');
    } catch (error) {
      console.error('Open account test failed:', error);
      await page.screenshot({ path: 'open-account-failure.png' });
      throw error;
    }
  });

  test('should delete customer', async ({ page }) => {
    // Arrange
    const managerPage = new ManagerPage(page);
    
    try {
      // First add a new customer to ensure we have one to delete
      const newCustomerData = managerPage.generateRandomCustomer();
      await managerPage.addNewCustomer(
        newCustomerData.firstName,
        newCustomerData.lastName,
        newCustomerData.postCode
      );
      
      // Wait for UI to update
      await page.waitForTimeout(1000);
      
      // Navigate to customers page
      await managerPage.navigateToCustomers();
      await managerPage.searchCustomer(newCustomerData.firstName);
      
      // Wait for search to complete
      await page.waitForTimeout(1000);
      
      // Get initial count of matching customers
      const initialCount = await managerPage.getCustomerCount();
      expect(initialCount).toBeGreaterThan(0);
      
      // Act - Delete the customer (first one in the filtered list)
      await managerPage.deleteCustomer(0);
      
      // Wait for deletion to complete
      await page.waitForTimeout(1000);
      
      // Assert
      // Either the count should be less than before or zero if there was only one match
      const finalCount = await managerPage.getCustomerCount();
      expect(finalCount).toBeLessThan(initialCount);
    } catch (error) {
      console.error('Delete customer test failed:', error);
      await page.screenshot({ path: 'delete-customer-failure.png' });
      throw error;
    }
  });

  test('should search for customers', async ({ page }) => {
    // Arrange
    const managerPage = new ManagerPage(page);
    const searchTerm = 'a'; // Common letter to find multiple results
    
    try {
      // Act - Search for customers
      await managerPage.navigateToCustomers();
      await managerPage.searchCustomer(searchTerm);
      
      // Wait for search to complete
      await page.waitForTimeout(1000);
      
      // Assert - Should find some customers
      const customerCount = await managerPage.getCustomerCount();
      expect(customerCount).toBeGreaterThan(0);
    } catch (error) {
      console.error('Search customers test failed:', error);
      await page.screenshot({ path: 'search-customers-failure.png' });
      throw error;
    }
  });
}); 
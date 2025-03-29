import { test, expect } from '@playwright/test';
import { LoginPage, CustomerPage } from '../src/pages';
import { BankTestData } from '../src/data/test-data';

test.describe('Customer Login Functionality', () => {
  // Add a hook to slow down tests to improve stability
  test.beforeEach(async ({ page }) => {
    // Set a moderate slow-down
    await page.context().setDefaultTimeout(30000);
  });

  test('should allow customer to login successfully', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const customerPage = new CustomerPage(page);
    const customerName = BankTestData.existingCustomers[0]; // Hermoine Granger
    
    // Act - Navigate to login page and perform customer login
    await loginPage.navigateToLoginPage();
    await loginPage.clickCustomerLogin();
    await customerPage.selectCustomer(customerName);
    await customerPage.clickLogin();
    
    // Assert - Verify user is logged in
    const welcomeMessage = await customerPage.getWelcomeMessage();
    expect(welcomeMessage).toContain(customerName);
  });
  
  test('should display account details after login', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const customerPage = new CustomerPage(page);
    const customerName = BankTestData.existingCustomers[1]; // Harry Potter
    
    // Act - Navigate to login page and perform customer login
    await loginPage.navigateToLoginPage();
    await loginPage.clickCustomerLogin();
    await customerPage.selectCustomer(customerName);
    await customerPage.clickLogin();
    
    // Assert - Verify account number dropdown is visible
    expect(await page.locator('#accountSelect').isVisible()).toBeTruthy();
  });

  test('should allow customer to logout successfully', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const customerPage = new CustomerPage(page);
    const customerName = BankTestData.existingCustomers[0]; // Hermoine Granger
    
    // Act - Navigate to login page, login and then logout
    await loginPage.navigateToLoginPage();
    await loginPage.clickCustomerLogin();
    await customerPage.selectCustomer(customerName);
    await customerPage.clickLogin();
    
    // Wait for the page to stabilize before logout
    await page.waitForTimeout(1000);
    
    await customerPage.logout();
    
    // Assert - Verify the customer dropdown is visible again (user is back to login screen)
    expect(await page.locator('#userSelect').isVisible()).toBeTruthy();
  });
}); 
/**
 * Constant test data for banking application tests
 */
export const BankTestData = {
  // Login data
  existingCustomers: [
    'Hermoine Granger',
    'Harry Potter',
    'Ron Weasly',
    'Albus Dumbledore',
    'Neville Longbottom'
  ],
  
  // Transaction data
  depositAmount: '1000',
  withdrawAmount: '500',
  invalidWithdrawAmount: '9999',
  
  // Bank Manager data
  currencies: ['Dollar', 'Pound', 'Rupee'],
  
  // New customer data
  newCustomer: {
    firstName: 'John',
    lastName: 'Doe',
    postCode: 'E12345'
  },
  
  // Error messages
  depositSuccessMessage: 'Deposit Successful',
  withdrawSuccessMessage: 'Transaction successful',
  withdrawErrorMessage: 'Transaction Failed. You can not withdraw amount more than the balance.',
  
  // Account numbers
  accountNumbers: ['1004', '1005', '1006']
}; 
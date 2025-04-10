# Banking Application Test Automation

This project implements a test automation framework for the GlobalSQA Banking Application using Playwright with TypeScript.

## Project Structure

The project follows the Page Object Model (POM) design pattern:

```
project/
│
├── src/
│   ├── pages/           # Page Object classes
│   │   ├── base-page.ts     # Base page with common methods
│   │   ├── login-page.ts    # Login page interactions
│   │   ├── customer-page.ts # Customer operations
│   │   ├── manager-page.ts  # Manager operations
│   │   └── transactions-page.ts # Transaction history
│   │
│   ├── utils/           # Utility functions
│   │   └── test-helper.ts   # Common test helpers
│   │
│   ├── config/          # Configuration files
│   │   └── environments.ts  # Environment settings
│   │
│   └── data/            # Test data
│       └── test-data.ts     # Constants and test data
│
├── tests/               # Test files
│   ├── customer-login.spec.ts
│   ├── customer-transactions.spec.ts
│   └── bank-manager.spec.ts
│
├── .github/
│   └── workflows/       # GitHub Actions workflows
│       ├── playwright.yml      # Main CI workflow (per-browser parallel jobs)
│       ├── cross-browser.yml   # Weekly cross-browser testing
│       └── pre-merge.yml       # Pre-merge comprehensive testing
│
├── .gitignore           # Git ignore file
├── CONTRIBUTING.md      # Contribution guidelines
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── playwright.config.ts # Playwright configuration
```

## Features

- **Page Object Model (POM)** - Clean separation of test logic and page interactions
- **TypeScript** - Type safety and better IDE support
- **Environment Configuration** - Simple local vs CI environment settings
- **Direct Navigation Fallbacks** - Uses direct URL navigation when UI interactions fail
- **Cross-browser Testing** - Supports Chromium, Firefox, and WebKit
- **CI/CD Integration** - Configured with GitHub Actions for automated testing
- **Parallel Testing** - Tests run in parallel across browsers for faster feedback

## Test Scenarios

The following test scenarios are covered:

1. **Customer Login Functionality**
   - Login as a customer
   - View account details
   - Logout functionality

2. **Customer Transaction Functionality**
   - Deposit money into account
   - Withdraw money from account
   - Handling invalid withdrawals
   - Viewing transaction history

3. **Bank Manager Functionality**
   - Adding new customers
   - Opening accounts for customers
   - Deleting customers
   - Searching for customers

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- NPM

### Installation

1. Clone the repository
   ```
   git clone https://github.com/dudziakm/globalsQA-banking.git
   cd globalsQA-banking
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Install browsers:
   ```
   npm run install:browsers
   ```

### Running Tests

Run all tests:
```
npm test
```

Run with headed browsers:
```
npm run test:headed
```

Run with UI mode for debugging:
```
npm run test:ui
```

Run specific test groups:
```
npm run test:customer
npm run test:manager
```

Run in specific browsers:
```
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

Run tests in CI mode locally:
```
npm run test:ci
```

Run tests in parallel:
```
npm run test:parallel
```

View test reports:
```
npm run report
```

Run test Codegen:
```
npx playwright codegen URL/TO/THE/WEBSITE
```

## Version Control

This project includes a comprehensive `.gitignore` file configured for Playwright projects. It excludes:

- Node modules and dependency files
- Test results and reports
- Environment configuration files
- IDE-specific files
- Build artifacts and logs
- Screenshots, videos, and traces from test runs

To start using version control:

1. Initialize a Git repository:
   ```
   git init
   ```
2. Add your files:
   ```
   git add .
   ```
3. Make your first commit:
   ```
   git commit -m "Initial commit"
   ```
4. Connect to your remote repository:
   ```
   git remote add origin https://github.com/dudziakm/globalsQA-banking.git
   git push -u origin main
   ```

For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Continuous Integration

This project is configured with GitHub Actions for continuous integration testing:

### Main Workflow (playwright.yml)
- Runs on every push to main/master branches
- Runs on every pull request to main/master branches
- Runs daily at midnight UTC
- **Parallel Jobs** - Runs tests for each browser (Chromium, Firefox, and WebKit) in parallel
- **Browser-Specific Isolation** - Issues in one browser don't affect other test runs

### Cross-Browser Testing (cross-browser.yml)
- Runs weekly on Sundays
- Can be triggered manually
- Runs tests in parallel for all browsers
- Provides a full compatibility check across all supported browsers

### Pre-Merge Testing (pre-merge.yml)
- Triggered when a pull request is labeled with 'ready-for-merge'
- Runs all tests across all browsers
- Ensures comprehensive testing before merging

### CI/CD Benefits:
- **Parallel Execution** - Multiple jobs run simultaneously for faster feedback
- **Browser Isolation** - Browser-specific issues are clearly identified
- **Fast Feedback** - PR checks provide immediate feedback on test status
- **Comprehensive Coverage** - All browsers are tested before merging

## Best Practices Implemented

- **Clean Code** - Well-structured and readable code
- **Descriptive Test Names** - Test names clearly describe what they're testing
- **Arrange-Act-Assert Pattern** - Tests follow the AAA pattern
- **Page Encapsulation** - Page objects hide implementation details
- **Error Handling** - Proper handling of alerts and timeout conditions
- **Scalable Architecture** - Easy to add new tests and pages
- **Defensive Navigation** - Tests use direct URLs when UI navigation is unreliable
- **Simple Configuration** - Just two environments: local and CI
- **Parallel Testing** - Tests run in parallel for faster execution

## Lessons Learned

- Playwright's auto-waiting mechanisms work well for most cases
- When working with potentially flaky applications, direct URL navigation is more reliable
- Simple environment configuration is sufficient for test automation
- Zero retries locally helps identify issues quickly during development
- Playwright automatically detects CI environments without manual configuration
- Running browsers in parallel jobs provides faster feedback and better isolation 
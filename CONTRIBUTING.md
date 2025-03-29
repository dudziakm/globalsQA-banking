# Contributing to Banking Application Test Automation

Thank you for considering contributing to this test automation framework. This document outlines the guidelines for contributing to the project.

## Git Workflow

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```
   git clone https://github.com/YOUR-USERNAME/globalsQA-banking.git
   cd globalsQA-banking
   ```
3. Add the upstream repository:
   ```
   git remote add upstream https://github.com/dudziakm/globalsQA-banking.git
   ```
4. Create a new branch for your changes:
   ```
   git checkout -b feature/your-feature-name
   ```

### Making Changes

1. Make your changes to the codebase
2. Run the tests to ensure your changes don't break existing functionality:
   ```
   npm test
   ```
3. Commit your changes with a descriptive commit message:
   ```
   git commit -m "Add new test for customer deposit validation"
   ```

### Push Changes and Create a Pull Request

1. Push your changes to your fork:
   ```
   git push origin feature/your-feature-name
   ```
2. Create a pull request from your fork to the main repository
3. Describe the changes you've made and any additional information that would be useful for reviewers

## Coding Standards

### General Guidelines

- Follow the existing code style and patterns
- Use meaningful variable and function names
- Keep functions small and focused on a single responsibility
- Add comments for complex logic
- Follow the Page Object Model pattern for new page objects

### TypeScript

- Use proper TypeScript types for all variables and functions
- Avoid using `any` type when possible
- Use interfaces for defining complex data structures

### Tests

- Each test should be independent and not rely on the state of other tests
- Use descriptive test names that explain what the test is verifying
- Follow the Arrange-Act-Assert pattern
- Use test data from the `test-data.ts` file when possible
- Add comments to explain complex test scenarios

## Running Tests

See the README.md file for detailed instructions on running tests locally and in CI mode.

## Adding New Tests

When adding new tests:

1. Determine if you need to create new page objects
2. Add test data to the appropriate data file
3. Create your test following the existing patterns
4. Run your test to ensure it passes
5. Add your test to the appropriate test group in the package.json scripts if needed

## Troubleshooting

If you encounter issues:

1. Check the Playwright documentation: https://playwright.dev/docs/intro
2. Review existing tests for examples
3. Use the debug mode: `npm run test:debug`
4. Check for any error messages in the test output

Thank you for contributing! 
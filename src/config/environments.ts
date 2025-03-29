/**
 * Environment configuration for test execution
 */

interface EnvironmentConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

// Playwright automatically detects CI environments by checking:
// CI, GITHUB_ACTIONS, GITLAB_CI, BUILDKITE, CIRCLECI, etc.
const isCI = !!process.env.CI || 
             !!process.env.GITHUB_ACTIONS || 
             !!process.env.GITLAB_CI || 
             !!process.env.BUILDKITE || 
             !!process.env.CIRCLECI;

const environments: Record<string, EnvironmentConfig> = {
  // Configuration for local development
  local: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#',
    timeout: 30000,
    retries: 0
  },
  
  // Configuration for CI environments
  ci: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#',
    timeout: 45000,
    retries: 1
  }
};

/**
 * Get current environment configuration
 * Uses CI detection logic that matches Playwright's internal detection
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  // If we're in CI, use CI config, otherwise use local
  // This matches how Playwright determines CI status internally
  return isCI ? environments.ci : environments.local;
}

export const isCIEnvironment = isCI;

export default getEnvironmentConfig(); 
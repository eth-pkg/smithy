// CLI Configuration
export const CLI_CONFIG = {
  NAME: 'smithy',
  VERSION: '0.1.0',
  DESCRIPTION: 'A CLI tool for generating Ethereum client configurations',
} as const;

// Default Values
export const DEFAULTS = {
  PRESET: 'default',
} as const;


// Exit Codes
export const EXIT_CODES = {
  SUCCESS: 0,
  ERROR: 1,
  INVALID_INPUT: 2,
  CONFIG_ERROR: 3,
  FATAL: 4,
} as const;

import { BaseError } from './BaseError';

export class ConfigError extends BaseError {
  constructor(
    message: string,
    public readonly configPath?: string,
    public readonly originalError?: Error
  ) {
    super(message, 'ConfigError', true, 'CONFIG_ERROR');
  }
} 
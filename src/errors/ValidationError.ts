import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: unknown
  ) {
    super(message, 'ValidationError', true, 'VALIDATION_ERROR');
  }
} 
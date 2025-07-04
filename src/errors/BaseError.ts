/**
 * Base error class for all application errors
 */
export abstract class BaseError extends Error {
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    name: string,
    isOperational = true,
    code?: string
  ) {
    super(message);
    this.name = name;
    this.isOperational = isOperational;
    this.code = code;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
} 
import chalk from "chalk";

export type LogLevel =
  | "error"
  | "warn"
  | "info"
  | "success"
  | "debug"
  | "verbose";

/**
 * Simple logger utility for CLI output
 */
export class Logger {
  private level: LogLevel;
  private readonly levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    success: 2,
    debug: 3,
    verbose: 4,
  };

  /**
   * Create a new logger instance
   * @param level Initial log level
   */
  constructor(level: LogLevel = "info") {
    this.level = level;
  }

  /**
   * Set the logger level
   * @param level Log level to set
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Check if the provided level should be logged
   * @param level Level to check
   * @returns True if the level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] <= this.levels[this.level];
  }

  /**
   * Format the current timestamp for log output
   * @returns Formatted timestamp string
   */
  private timestamp(): string {
    return new Date().toISOString().replace("T", " ").substr(0, 19);
  }

  /**
   * Log an error message
   * @param message Message to log
   */
  error(message: string): void {
    if (this.shouldLog("error")) {
      console.error(chalk.red(`[ERROR] ${message}`));
    }
  }

  /**
   * Log a warning message
   * @param message Message to log
   */
  warn(message: string): void {
    if (this.shouldLog("warn")) {
      console.warn(chalk.yellow(`[WARN] ${message}`));
    }
  }

  /**
   * Log an info message
   * @param message Message to log
   */
  info(message: string): void {
    if (this.shouldLog("info")) {
      console.info(chalk.blue(`[INFO] ${message}`));
    }
  }

  /**
   * Log a success message
   * @param message Message to log
   */
  success(message: string): void {
    if (this.shouldLog("success")) {
      console.info(chalk.green(`[SUCCESS] ${message}`));
    }
  }

  /**
   * Log a debug message
   * @param message Message to log
   */
  debug(message: string): void {
    if (this.shouldLog("debug")) {
      console.debug(chalk.cyan(`[DEBUG] ${message}`));
    }
  }

  /**
   * Log a verbose message
   * @param message Message to log
   */
  verbose(message: string): void {
    if (this.shouldLog("verbose")) {
      console.debug(chalk.gray(`[VERBOSE] ${message}`));
    }
  }
}

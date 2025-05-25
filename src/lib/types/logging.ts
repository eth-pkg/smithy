export interface LogConfig {
  enabled: boolean
  console: {
    enabled: boolean
    level: string
    format: string,
    color: boolean
  }
  file: {
    enabled: boolean
    level: string
    format: string,
    directory: string,
    name: string,
    fullPath: string
  }
} 
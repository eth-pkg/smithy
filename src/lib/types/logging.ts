export interface LogConfig {
  enabled: boolean
  stdout: {
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
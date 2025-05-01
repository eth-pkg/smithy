import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSyncModeDescription = (mode: string): string => {
  switch (mode) {
    case "full":
      return "Downloads and verifies the entire blockchain history"
    case "checkpoint":
      return "Syncs from a trusted checkpoint for faster setup"
    default:
      return ""
  }
}

export const getCommunicationDescription = (type: string): string => {
  switch (type) {
    case "jwt":
      return "JSON Web Token authentication between clients"
    case "ipc":
      return "Inter-Process Communication between clients"
    default:
      return ""
  }
}
export const executionClients = [
  {
    id: "geth",
    name: "Geth",
    description: "Go Ethereum - Official Go implementation",
    color: "blue",
  },
  {
    id: "erigon",
    name: "Erigon",
    description: "Optimized for storage efficiency",
    color: "purple",
  },
  {
    id: "besu",
    name: "Besu",
    description: "Enterprise-focused Java client",
    color: "orange",
  },
  {
    id: "nethermind",
    name: "Nethermind",
    description: ".NET implementation with high performance",
    color: "green",
  },
  {
    id: "reth",
    name: "Reth",
    description: "Rust implementation focusing on efficiency",
    color: "red",
  },
]

export const consensusClients = [
  {
    id: "lighthouse",
    name: "Lighthouse",
    description: "Rust implementation by Sigma Prime",
    color: "amber",
  },
  {
    id: "prysm",
    name: "Prysm",
    description: "Go implementation by Prysmatic Labs",
    color: "indigo",
  },
  {
    id: "teku",
    name: "Teku",
    description: "Java implementation by ConsenSys",
    color: "emerald",
  },
  {
    id: "nimbus-eth2",
    name: "Nimbus",
    description: "Nim implementation for resource-restricted devices",
    color: "rose",
  },
  {
    id: "lodestar",
    name: "Lodestar",
    description: "TypeScript implementation by ChainSafe",
    color: "cyan",
  },
]

/**
 * Format a file path based on the operating system
 */
export function formatPathForOS(path: string, os = "linux"): string {
  if (!path) return path

  // Replace $HOME with the appropriate OS-specific home directory reference
  let formattedPath = path

  if (os === "windows") {
    // Windows uses %USERPROFILE% and backslashes
    formattedPath = formattedPath.replace(/\$HOME/g, "%USERPROFILE%")
    formattedPath = formattedPath.replace(/\//g, "\\")
  } else if (os === "macos") {
    // macOS uses $HOME and forward slashes (same as Linux)
    formattedPath = formattedPath.replace(/\$HOME/g, "$HOME")
  } else {
    // Linux uses $HOME and forward slashes
    formattedPath = formattedPath.replace(/\$HOME/g, "$HOME")
  }

  return formattedPath
}

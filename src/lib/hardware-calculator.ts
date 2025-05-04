import type { NodeConfig } from "@/lib/types"

export interface HardwareRequirements {
  storage: {
    initialSync: string
    monthlyGrowth: string
    yearProjection: string
    executionLayer: string
    consensusLayer: string
  }
  memory: {
    minimum: string
    recommended: string
    peakUsage: string
  }
  cpu: {
    minimumCores: number
    recommendedCores: number
    architecture: string
  }
  network: {
    syncBandwidth: string
    monthlyBandwidth: string
    recommendedLatency: string
  }
}

// Calculate hardware requirements based on the configuration
export function calculateHardwareRequirements(config: NodeConfig): HardwareRequirements {
  const { commonConfig, validatorConfig } = config
  const executionClient = executionConfig.client.name || ""
  const consensusClient = consensusConfig.client.name || ""
  const network = commonConfig.network || "mainnet"
  const isStaking = validatorConfig.enabled || false
  const syncMode = commonConfig.syncMode || "full"

  // Default values for mainnet
  let initialStorage = "600 GB"
  let monthlyGrowth = "20-30 GB"
  let yearProjection = "900 GB - 1 TB"
  let executionStorage = "500 GB"
  let consensusStorage = "100 GB"

  let minRam = "8 GB"
  let recommendedRam = "16 GB"
  let peakRam = "12 GB"

  let minCores = 4
  let recommendedCores = 8
  const architecture = "64-bit x86 architecture recommended. ARM64 is also supported by most clients."

  let syncBandwidth = "1-5 Mbps"
  let monthlyBandwidth = "300-500 GB"
  let recommendedLatency = "<100ms"

  // Adjust based on network
  if (network !== "mainnet") {
    initialStorage = "150 GB"
    monthlyGrowth = "5-10 GB"
    yearProjection = "250-300 GB"
    executionStorage = "120 GB"
    consensusStorage = "30 GB"

    minRam = "4 GB"
    recommendedRam = "8 GB"
    peakRam = "6 GB"

    minCores = 2
    recommendedCores = 4

    syncBandwidth = "0.5-2 Mbps"
    monthlyBandwidth = "100-200 GB"
  }

  // Adjust based on execution client
  if (executionClient === "geth") {
    if (network === "mainnet") {
      executionStorage = "500 GB (full), 400 GB (snap)"
    }
  } else if (executionClient === "erigon") {
    if (network === "mainnet") {
      executionStorage = "400 GB"
      monthlyGrowth = "15-25 GB"
    }
  } else if (executionClient === "nethermind") {
    if (network === "mainnet") {
      executionStorage = "550 GB"
      minRam = "8 GB"
      recommendedRam = "16 GB"
    }
  } else if (executionClient === "besu") {
    if (network === "mainnet") {
      executionStorage = "550 GB"
      minRam = "8 GB"
      recommendedRam = "16 GB"
    }
  }

  // Adjust based on consensus client
  if (consensusClient === "lighthouse") {
    if (network === "mainnet") {
      consensusStorage = "100 GB"
    }
  } else if (consensusClient === "prysm") {
    if (network === "mainnet") {
      consensusStorage = "120 GB"
    }
  } else if (consensusClient === "teku") {
    if (network === "mainnet") {
      consensusStorage = "110 GB"
      minRam = "8 GB"
      recommendedRam = "16 GB"
    }
  } else if (consensusClient === "nimbus-eth2") {
    if (network === "mainnet") {
      consensusStorage = "90 GB"
      minRam = "4 GB"
      recommendedRam = "8 GB"
    }
  } else if (consensusClient === "lodestar") {
    if (network === "mainnet") {
      consensusStorage = "130 GB"
    }
  }

  // Adjust for staking
  if (isStaking) {
    minRam = Number.parseInt(minRam) + 4 + " GB"
    recommendedRam = Number.parseInt(recommendedRam) + 4 + " GB"
    peakRam = Number.parseInt(peakRam) + 4 + " GB"

    minCores += 2
    recommendedCores += 2

    recommendedLatency = "<50ms"
  }

  // Adjust for sync mode
  if (syncMode === "full") {
    if (network === "mainnet") {
      executionStorage = "1.5 TB"
      yearProjection = "2 TB+"
    }
  }

  return {
    storage: {
      initialSync: initialStorage,
      monthlyGrowth: monthlyGrowth,
      yearProjection: yearProjection,
      executionLayer: executionStorage,
      consensusLayer: consensusStorage,
    },
    memory: {
      minimum: minRam,
      recommended: recommendedRam,
      peakUsage: peakRam,
    },
    cpu: {
      minimumCores: minCores,
      recommendedCores: recommendedCores,
      architecture: architecture,
    },
    network: {
      syncBandwidth: syncBandwidth,
      monthlyBandwidth: monthlyBandwidth,
      recommendedLatency: recommendedLatency,
    },
  }
}

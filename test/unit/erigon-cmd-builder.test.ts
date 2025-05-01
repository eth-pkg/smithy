import { expect } from "chai"
import type { NodeConfig } from "@/lib/types"
import { CommandClientRegistry } from "@/lib/builders/command/command-client-registry"

describe("ErigonCommandBuilder", () => {
  describe("buildFromConfig", () => {
    it("should build command with correct flags and arguments", () => {
      const config: NodeConfig = {
        commonConfig: {
          networkId: 1,
          clients: {
            execution: "erigon",
            consensus: "lighthouse",
            validator: ""
          },
          dataDir: "/path/to/data",
          engine: {
            host: "localhost",
            apiPort: 8551,
            communication: "jwt",
            endpointUrl: "",
            ip: "",
            jwtFile: "",
            scheme: "http"
          },
          features: {
            mevBoost: false,
            monitoring: false,
            staking: false
          },
          network: "mainnet",
          operatingSystem: "linux",
          syncMode: "snap"
        },
        consensusConfig: {
          httpPort: 5052,
          metricsPort: 8008,
          p2pPort: 9000
        },
        validatorConfig: {
          dataDir: "",
          beaconRpcProvider: "",
          numValidators: 0,
          feeRecipientAddress: "",
          metricsPort: "0"
        },
        executionConfig: {
          http: {
            enabled: true,
            port: 8545,
            cors: [],
            apiPrefixes: []
          },
          ws: {
            enabled: true,
            port: 8546
          },
          metrics: {
            enabled: true,
            port: 6060
          },
          p2p: {
            port: 30303,
            maxPeers: 50
          }
        }
      }

      const registry = new CommandClientRegistry();
      const command = registry.getScriptContent("erigon", config);
      const commandString = command.toString()

      // Test basic flags and arguments
      expect(commandString).to.include("--datadir")
      expect(commandString).to.include("/path/to/data")
      expect(commandString).to.include("--http")
      expect(commandString).to.include("--http.port")
      expect(commandString).to.include("8545")
      expect(commandString).to.include("--ws")
      expect(commandString).to.include("--ws.port")
      expect(commandString).to.include("8546")
      expect(commandString).to.include("--metrics")
      expect(commandString).to.include("--metrics.port")
      expect(commandString).to.include("6060")
      expect(commandString).to.include("--port")
      expect(commandString).to.include("30303")
      expect(commandString).to.include("--maxpeers")
      expect(commandString).to.include("50")
    })

    it("should handle Windows path formatting", () => {
      const config: NodeConfig = {
        commonConfig: {
          networkId: 1,
          clients: {
            execution: "erigon",
            consensus: "lighthouse",
            validator: ""
          },
          dataDir: "C:/path/to/data",
          engine: {
            host: "localhost",
            apiPort: 8551,
            communication: "jwt",
            endpointUrl: "",
            ip: "",
            jwtFile: "",
            scheme: "http"
          },
          features: {
            mevBoost: false,
            monitoring: false,
            staking: false
          },
          network: "mainnet",
          operatingSystem: "windows",
          syncMode: "snap"
        },
        consensusConfig: {
          httpPort: 5052,
          metricsPort: 8008,
          p2pPort: 9000
        },
        validatorConfig: {
          dataDir: "",
          beaconRpcProvider: "",
          numValidators: 0,
          feeRecipientAddress: "",
          metricsPort: "0"
        },
        executionConfig: {
          http: {
            enabled: true,
            port: 8545,
            cors: [],
            apiPrefixes: []
          },
          ws: {
            enabled: true,
            port: 8546
          },
          metrics: {
            enabled: true,
            port: 6060
          },
          p2p: {
            port: 30303,
            maxPeers: 50
          }
        }
      }

      const registry = new CommandClientRegistry();
      const command = registry.getScriptContent("erigon", config);
      const commandString = command.toString()

      expect(commandString).to.include("C:\\path\\to\\data")
    })

    it("should handle boolean flags correctly", () => {
      const config: NodeConfig = {
        commonConfig: {
          networkId: 1,
          clients: {
            execution: "erigon",
            consensus: "lighthouse",
            validator: ""
          },
          dataDir: "/path/to/data",
          engine: {
            host: "localhost",
            apiPort: 8551,
            communication: "jwt",
            endpointUrl: "",
            ip: "",
            jwtFile: "",
            scheme: "http"
          },
          features: {
            mevBoost: false,
            monitoring: false,
            staking: false
          },
          network: "mainnet",
          operatingSystem: "linux",
          syncMode: "snap"
        },
        consensusConfig: {
          httpPort: 5052,
          metricsPort: 8008,
          p2pPort: 9000
        },
        validatorConfig: {
          dataDir: "",
          beaconRpcProvider: "",
          numValidators: 0,
          feeRecipientAddress: "",
          metricsPort: "0"
        },
        executionConfig: {
          http: {
            enabled: true,
            port: 8545,
            cors: [],
            apiPrefixes: []
          },
          ws: {
            enabled: false,
            port: 8546
          },
          metrics: {
            enabled: true,
            port: 6060
          },
          p2p: {
            port: 30303,
            maxPeers: 50
          }
        }
      }

      const registry = new CommandClientRegistry();
      const command = registry.getScriptContent("erigon", config);
      const commandString = command.toString()
      console.log(commandString)
      expect(commandString).to.include("--http")
      expect(commandString).not.to.include("--ws")
    })


    it("should handle array values with comma joining", () => {
      const config: NodeConfig = {
        commonConfig: {
          networkId: 1,
          clients: {
            execution: "erigon",
            consensus: "lighthouse",
            validator: ""
          },
          dataDir: "/path/to/data",
          engine: {
            host: "localhost",
            apiPort: 8551,
            communication: "jwt",
            endpointUrl: "",
            ip: "",
            jwtFile: "",
            scheme: "http"
          },
          features: {
            mevBoost: false,
            monitoring: false,
            staking: false
          },
          network: "mainnet",
          operatingSystem: "linux",
          syncMode: "snap"
        },
        consensusConfig: {
          httpPort: 5052,
          metricsPort: 8008,
          p2pPort: 9000
        },
        validatorConfig: {
          dataDir: "",
          beaconRpcProvider: "",
          numValidators: 0,
          feeRecipientAddress: "",
          metricsPort: "0"
        },
        executionConfig: {
          http: {
            enabled: true,
            port: 8545,
            cors: [],
            apiPrefixes: ["eth", "net", "web3"]
          },
          ws: {
            enabled: true,
            port: 8546
          },
          metrics: {
            enabled: true,
            port: 6060
          },
          p2p: {
            port: 30303,
            maxPeers: 50
          }
        }
      }

      const registry = new CommandClientRegistry();
      const command = registry.getScriptContent("erigon", config);
      const commandString = command.toString()

      expect(commandString).to.include("eth,net,web3")
    })
  })
}) 
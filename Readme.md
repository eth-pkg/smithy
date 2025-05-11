# Smithy

## Overview

Smithy simplifies Ethereum client setup by generating precise command-line arguments for execution (e.g., Geth), consensus (e.g., Lighthouse), and validator (e.g., Prysm) clients, with env and configuration file support planned. It reduces errors post-merge, where clients split into components with varying configuration requirements.

> **⚠️ Early Development Notice**  
> This is an early development version of Smithy. Do not use in production or testnets yet. You can test it against your current configurations and help improve it by:
> - Reporting missing mappings or features
> - Submitting bug reports
> - Contributing directly to the project
> 
> Breaking changes will be introduced as the project evolves. We recommend checking the changelog before updating to new versions.

Instead of manually configuring:
```bash
geth --datadir /path/to/data --http --http.port 8545 --http.api eth,net,web3 --authrpc.jwtsecret /path/to/jwt.hex --mainnet
```

Run:
```bash
smithy generate --execution geth --consensus lighthouse
```

Smithy delivers correct commands, saving time and preventing errors.

## Benefits

- **Automation**: Eliminates manual flag setup.
- **Accuracy**: Ensures compatible, correct arguments.
- **Flexibility**: Supports diverse client combinations.
- **Validation**: Instantly flags invalid settings.
- **Best Practices**: Applies secure, recommended defaults.

## Installation

```bash
npm install -g smithy
```

## Development

To run Smithy in development mode:

```bash
# Clone the repository
git clone https://github.com/eth-pkg/smithy.git
cd smithy

# Install dependencies
npm install

# Run in development mode
npm run dev -- --execution geth --consensus lighthouse
```

The development mode uses `ts-node-dev` which provides hot-reloading, so any changes to the source code will automatically restart the application.

## Usage

Generate commands:
```bash
# Full node
smithy generate --execution geth --consensus lighthouse

# Validator node
smithy generate --execution geth --consensus lighthouse --validator lighthouse

# Alternative clients
smithy generate --execution nethermind --consensus prysm
```

Available options for the `generate` command:
- `-p, --preset <preset>`: Preset to validate against (default: "default")
- `-e, --execution <client>`: Execution client (e.g., geth, nethermind, besu)
- `-c, --consensus <client>`: Consensus client (e.g., lighthouse, prysm, teku)
- `-v, --validator <client>`: Validator client (e.g., lighthouse, prysm, teku)
- `-o, --output <directory>`: Output directory for configuration files
- `-f, --config-file <path>`: Path to a configuration file to use as base
- `--verbose`: Enable verbose logging

List available presets:
```bash
smithy presets
```

Run the generated commands to start your clients.

## Configuration

- **Quick Start**: Specify clients for instant setup:
  ```bash
  smithy generate --execution geth --consensus lighthouse
  ```

- **Saved Config**: Store settings for reuse:
  ```bash
  smithy generate --execution geth --consensus lighthouse --config-file my-config.yml
  ```

Config files allow overriding all schema-defined values (e.g., ports, directories, networks) while enforcing preset validation rules, ensuring compatibility and correctness across clients with differing expectations.

For detailed information about the configuration schema and supported fields, see [Configuration.md](Configuration.md).

## As a Library

Use Smithy in Node.js to generate commands, which are written to files in the specified output directory or throw an error if generation fails:
```javascript
import { Smithy } from 'smithy';

const smithy = new Smithy();
try {
  await smithy.generate({
    execution: 'geth',
    consensus: 'lighthouse',
    validator: 'lighthouse',
    preset: 'default',
    output: './configs',
    configFile: './my-config.yml',
    verbose: true
  });
  console.log('Configuration files written to ./configs');
} catch (error) {
  console.error('Failed to generate configurations:', error.message);
}
```

## Configuration Schema

Below is the core JSON schema structure for Smithy configurations, excluding validation rules and defaults for brevity. Currently, only `engine`, `dataDir`, and `client` names are mapped to client-specific flags, with other fields as work in progress.

```yaml
$id: base.yml
type: object
required:
  - common
properties:
  common:
    type: object
    properties:
      acceptTermsOfUse:
        type: boolean
        description: "Accept the terms of use"
      dataDir:
        type: string
        description: "Base directory for storing Ethereum client data"
      engine:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable the Engine API"
          port:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for the Engine API"
          communication:
            type: object
            method:
              type: string
              enum:
                - jwt
                - ipc
              description: "Authentication method for Engine API communication"
            jwtId:
              type: string
              description: "JWT claims id for client identification"
            jwtFile:
              type: string
              description: "Path to the JWT secret file for Engine API authentication"  
          url:
            type: string
            description: "URL for the Engine API endpoint"
          host:
            type: string
            description: "Hostname for the Engine API"
          allowlist:
            type: array
            items:
              type: string
            description: "Allowed hostnames for the Engine API"
          ip:
            type: string
            pattern: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$"
            description: "IP address for the Engine API"
       
          scheme:
            type: string
            enum:
              - http
              - https
            description: "Protocol scheme for Engine API communication"
          ipcPath:
            type: string
            description: "Path to the IPC file for Engine API communication"
      network:
        type: object
        name:
          type: string
          enum:
            - mainnet
            - sepolia
            - holesky
            - hoodi
            - ephemery
            - custom
          description: "Ethereum network to connect to"
        id:
          type: number
          minimum: 1
          description: "The Ethereum network ID (1 for mainnet, 11155111 for sepolia, etc.)"
      operatingSystem:
        type: string
        enum:
          - linux
          - darwin
          - windows
        description: "Target operating system for client configuration"
      syncMode:
        type: string
        enum:
          - snap
          - full
          - light
        description: "Blockchain synchronization mode"
  execution:
    type: object
    required: [client]
    properties:
      client:
        type: object
        required: [name]
        properties:
          name:
            type: string
            enum:
              - besu
              - erigon
              - geth
              - nethermind
              - reth
            description: "The execution client implementation to use"
          version:
            type: string
            description: "The version of the execution client to use"
      isExternal:
        type: boolean
        description: "Is the consensus client external to the node, in different process"
      http:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable HTTP JSON-RPC API"
          api:
            type: array
            minItems: 1
            description: "List of JSON-RPC API namespaces to enable"
            items:
              type: string
          address:
            type: string
          allowlist:
            type: array
            description: "List of allowed CORS origins for HTTP API"
            items:
              type: string
          port:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for HTTP JSON-RPC API"
          tls:
            type: object
            properties:
              enabled:
                type: boolean
                description: "Enable TLS for HTTP JSON-RPC API"
              cert:
                type: string
                description: "Path to the TLS certificate file"
              key:
                type: string
      metrics:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable metrics collection and reporting"
          port:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for metrics server"
      p2p:
        type: object
        properties:
          maxPeers:
            type: number
            minimum: 1
            maximum: 1000
            description: "Maximum number of P2P peers to connect to"
          port:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for P2P networking"
          bootnodes:
            type: array
            items:
              type: string
            description: "List of bootnode enode URLs for initial peer discovery"
          enrAddress:
            type: string
            description: "ENR (Ethereum Node Record) address to advertise"
          udpPort:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for P2P networking"
          relayNode:
            type: string
            description: "Relay node address for P2P networking"
          allowlist:
            type: array
            items:
              type: string
            description: "List of allowed CORS origins for P2P networking"
          denylist:
            type: array
            items:
              type: string
            description: "List of denied CORS origins for P2P networking"
      ws:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable WebSocket JSON-RPC API"
          port:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for WebSocket JSON-RPC API"
      dataDir:
        type: string
        description: "Base directory for execution client data"
  consensus:
    type: object
    required: [client]
    properties:
      client:
        type: object
        required: [name]
        properties:
          name:
            type: string
            enum:
              - lighthouse
              - lodestar
              - nimbus-eth2
              - prysm
              - teku
            description: "The consensus client implementation to use"
          version:
            type: string
            description: "The version of the consensus client to use"
      http:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable HTTP JSON-RPC API"
          api:
            type: array
            minItems: 1
            description: "List of JSON-RPC API namespaces to enable"
            items:
              type: string
          address:
            type: string
          allowlist:
            type: array
            description: "List of allowed CORS origins for HTTP API"
            items:
              type: string
          port:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for HTTP JSON-RPC API"
      metrics:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable metrics collection and reporting"
          host:
            type: string
            description: "IP address to bind the metrics server to"
          port:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for metrics server of the consensus client"
      p2p:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable P2P networking of the consensus client"
          port:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for P2P networking of the consensus client"
          port6:
            type: number
            minimum: 1024
            maximum: 65535
            description: "IPv6 P2P port number (0 to disable IPv6)"    
          udpPort:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for P2P networking of the consensus client"
          bootnodes:
            type: array
            items:
              type: string
            description: "List of bootnode enode URLs for initial peer discovery"
          enrAddress:
            type: string
            description: "ENR (Ethereum Node Record) address to advertise"    
      ws: 
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable WebSocket JSON-RPC API"
          port:
            type: number
            minimum: 1024
            maximum: 65535
            description: "Port number for WebSocket JSON-RPC API"
      checkpoint:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable checkpoint sync"
          url:
            type: string
            description: "URL of a trusted beacon node for checkpoint sync"
          block:
            type: string
            description: "Block root hash to use for checkpoint sync"
          state:
            type: string
            description: "State root hash to use for checkpoint sync"
          weakSubjectivity:
            type: string
            description: "Weak subjectivity checkpoint to use for checkpoint sync"
      graffiti:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable graffiti on proposed blocks"
          message:
            type: string
            description: "Custom graffiti message to include in proposed blocks"
          file:
            type: string
            description: "Path to file containing graffiti messages"
      log: 
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable logging of the consensus client"
          file:
            type: string
            description: "Path to store consensus client logs"
          format:
            type: string
            enum:
              - auto
              - json
              - plain
      testnetDir:
        type: string
        description: "Path to testnet configuration directory"
      validatorMonitorFile:
        type: string
        description: "Path to file for validator monitoring data"
      builder:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable block builder API for MEV"
          url:
            type: string
            description: "URL for the block builder API"
      dataDir:
        type: string
        description: "Base directory for consensus client data"
  validator:
    type: object
    properties:
      enabled:
        type: boolean
        description: "Enable validator functionality"
      isExternal:
        type: boolean
        description: "Is the validator external to the node, in different process"
      client:
        type: object
        required: [name]
        properties:
          name:
            type: string
            enum:
              - lighthouse
              - lodestar
              - nimbus-eth2
              - prysm
              - teku
              - ""
            description: "The validator client implementation to use"
          version:
            type: string
            description: "The version of the validator client to use"
      dataDir:
        type: string
        description: "Base directory for validator data"
      beaconRpcProvider:
        type: string
        description: "Beacon node RPC endpoint (host:port)"
      numValidators:
        type: number
        minimum: 1
        description: "Number of validators to run"
      feeRecipientAddress:
        type: string
        description: "Ethereum address to receive transaction fees"
      metrics:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable validator metrics collection"  
          host:
            type: string
            description: "IP address to bind the metrics server to"
          port:
            type: number
            minimum: 1024
      graffiti: 
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable graffiti on proposed blocks"
          message:
            type: string
            description: "Custom graffiti message to include in proposed blocks"
          file:
            type: string
            description: "Path to file containing graffiti messages"
      suggestedGasLimit:
        type: number
        description: "Suggested gas limit for proposed blocks"
      doppelgangerProtection:
        type: boolean
        description: "Enable protection against duplicate validator instances"
      builderEnabled:
        type: boolean
        description: "Enable block builder API"
      externalSigner:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable external signer"
          url:
            type: string
            description: "URL for external signer service"
          keystore:
            type: string
            description: "Path to external signer keystore"
          keystorePasswordFile:
            type: string
            description: "Path to file containing external signer keystore password"
          publicKeys:
            type: array
            items:
              type: string
            description: "List of public keys for external signer"
          timeout:
            type: number
            description: "Timeout in milliseconds for external signer requests"
          truststore:
            type: string
            description: "Path to external signer truststore"
          truststorePasswordFile:
            type: string
            description: "Path to file containing external signer truststore password"
      proposerConfig:
        type: object
        properties:
          enabled:
            type: boolean
            description: "Enable proposer configuration"
          file:
            type: string
            description: "Path to proposer configuration file"
          refreshEnabled:
            type: boolean
            description: "Enable refresh of proposer configuration"
          blindedBlocksEnabled:
            type: boolean
            description: "Enable blinded block proposals"
          refreshInterval:
            type: number
            description: "Refresh interval for proposer configuration"
          maxValidators:
            type: number
            description: "Maximum number of validators"
          maxProposerDelay:
            type: number
            description: "Maximum proposer delay"
      validatorsDir:
        type: string
        description: "Directory containing validator keys"
      secretsDir:
        type: string
        description: "Directory containing validator secrets"
      distributed:
        type: boolean
        description: "Enable distributed validator mode"
```

And as an overridable config file 
```yaml 
common:
  acceptTermsOfUse: false
  dataDir: "{HOME}/{common.network}"
  engine:
    enabled: true
    port: 8551
    communication: "jwt"
    url: "{common.engine.scheme}://{common.engine.host}:{common.engine.port}"
    host: "localhost"
    allowlist: ["localhost"]
    ip: "127.0.0.1"
    jwtId: ""
    jwtFile: "{common.dataDir}/jwt.hex"
    scheme: "http"
    ipcPath: "{common.dataDir}/engine.ipc"
  network: "mainnet"
  networkId: 1
  operatingSystem: "linux"
  syncMode: "snap"

execution:
  client:
    name: ""  # Required, no default
    version: ""
  isExternal: true
  http:
    enabled: true
    api: ["eth", "net", "web3"]
    address: "localhost"
    allowlist: ["*"]
    port: 8545
    tls:
      enabled: false
      cert: ""
      key: ""
  metrics:
    enabled: true
    port: 6060
  p2p:
    maxPeers: 50
    port: 30303
    bootnodes: []
    enrAddress: ""
    udpPort: 30303
    relayNode: ""
    allowlist: ["*"]
    denylist: []
  ws:
    enabled: false
    port: 8546
  dataDir: "{common.dataDir}/{execution.client.name}"

consensus:
  client:
    name: ""  # Required, no default
    version: ""
  http:
    enabled: false
    api: ["eth", "net", "web3"]
    address: "localhost"
    allowlist: ["*"]
    port: 8545
  metrics:
    enabled: false
    host: "127.0.0.1"
    port: 8008
  p2p:
    enabled: true
    port: 9000
    port6: 9000
    udpPort: 9000
    bootnodes: []
    enrAddress: ""
  ws:
    enabled: false
    port: 8546
  checkpoint:
    enabled: false
    url: ""
    block: ""
    state: ""
    weakSubjectivity: ""
  graffiti:
    enabled: true
    message: ""
    file: ""
  log:
    enabled: true
    file: ""
    format: "auto"
  testnetDir: ""
  validatorMonitorFile: ""
  builder:
    enabled: false
    url: ""
  dataDir: "{common.dataDir}/{consensus.client.name}"

validator:
  enabled: false
  isExternal: true
  client:
    name: ""
    version: ""
  dataDir: "{common.dataDir}/{validator.client.name}-validator"
  beaconRpcProvider: "localhost:5052"
  numValidators: 1
  feeRecipientAddress: "0x0000000000000000000000000000000000000000"
  metrics:
    enabled: true
    host: "127.0.0.1"
    port: null  # Default not specified in the schema
  graffiti:
    enabled: true
    message: ""
    file: ""
  suggestedGasLimit: 30000000
  doppelgangerProtection: true
  builderEnabled: false
  externalSigner:
    enabled: false
    url: ""
    keystore: ""
    keystorePasswordFile: ""
    publicKeys: []
    timeout: 5000
    truststore: ""
    truststorePasswordFile: ""
  proposerConfig:
    enabled: false
    file: ""
    refreshEnabled: false
    blindedBlocksEnabled: false
    refreshInterval: 0
    maxValidators: 1000000
    maxProposerDelay: 0
  validatorsDir: "$HOME/ethereum/validator/keys"
  secretsDir: "$HOME/ethereum/validator/secrets"
  distributed: false
```

## Supported Schema Fields

The following table indicates the current mapping status of schema fields to client-specific flags. Only `engine`, `dataDir`, and `client` names are currently mapped, with other fields as work in progress.


| Schema Section       | Field                                | Mapping Status       |
|----------------------|--------------------------------------|----------------------|
| common         | dataDir                              | Mapped               |
| common         | engine                               | Mapped               |
| common         | network                              | Mapped               |
| common         | networkId                            | Mapped               |
| common         | operatingSystem                      | Mapped               |
| common         | syncMode                             | Work in Progress     |
| execution      | client.name                          | Mapped               |
| execution      | client.version                       | Work in Progress     |
| execution      | http                                 | Work in Progress     |
| execution      | metrics                              | Work in Progress     |
| execution      | p2p                                  | Work in Progress     |
| execution      | ws                                   | Work in Progress     |
| execution      | dataDir                              | Mapped               |
| consensus      | client.name                          | Mapped               |
| consensus      | client.version                       | Work in Progress     |
| consensus      | httpPort                             | Work in Progress     |
| consensus      | metricsPort                          | Work in Progress     |
| consensus      | p2pPort                              | Work in Progress     |
| consensus      | checkpointSyncUrl                    | Work in Progress     |
| consensus      | checkpointBlock                      | Work in Progress     |
| consensus      | checkpointState                      | Work in Progress     |
| consensus      | graffiti                             | Work in Progress     |
| consensus      | logFile                              | Work in Progress     |
| consensus      | logFormat                            | Work in Progress     |
| consensus      | metricsAddress                       | Work in Progress     |
| consensus      | monitoringEndpoint                   | Work in Progress     |
| consensus      | bootnodes                            | Work in Progress     |
| consensus      | enrAddress                           | Work in Progress     |
| consensus      | port6                                | Work in Progress     |
| consensus      | discoveryPort                        | Work in Progress     |
| consensus      | testnetDir                           | Work in Progress     |
| consensus      | validatorMonitorFile                 | Work in Progress     |
| consensus      | builder                              | Work in Progress     |
| consensus      | dataDir                              | Mapped               |
| validator      | enabled                              | Mapped               |
| validator      | client.name                          | Mapped               |
| validator      | client.version                       | Work in Progress     |
| validator      | dataDir                              | Mapped               |
| validator      | beaconRpcProvider                    | Work in Progress     |
| validator      | numValidators                        | Work in Progress     |
| validator      | feeRecipientAddress                  | Work in Progress     |
| validator      | metricsPort                          | Work in Progress     |
| validator      | graffiti                             | Work in Progress     |
| validator      | graffitiFile                         | Work in Progress     |
| validator      | proposerConfigFile                   | Work in Progress     |
| validator      | suggestedGasLimit                    | Work in Progress     |
| validator      | doppelgangerProtection               | Work in Progress     |
| validator      | builderEnabled                       | Work in Progress     |
| validator      | externalSignerUrl                    | Work in Progress     |
| validator      | externalSignerKeystore               | Work in Progress     |
| validator      | externalSignerKeystorePasswordFile   | Work in Progress     |
| validator      | externalSignerPublicKeys             | Work in Progress     |
| validator      | externalSignerTimeout                | Work in Progress     |
| validator      | externalSignerTruststore             | Work in Progress     |
| validator      | externalSignerTruststorePasswordFile | Work in Progress     |
| validator      | proposerBlindedBlocksEnabled         | Work in Progress     |
| validator      | proposerConfigRefreshEnabled         | Work in Progress     |
| validator      | metricsEnabled                       | Work in Progress     |
| validator      | validatorsDir                        | Work in Progress     |
| validator      | secretsDir                           | Work in Progress     |
| validator      | distributed                          | Work in Progress     |
## How It Works

Smithy uses JSON schema-based presets with:
1. **Schema**: Defines standardized settings across clients (e.g., data directories, ports), requiring only JSON schema knowledge.
2. **Validation**: Enforces rules for network consistency, valid ports, and client compatibility (e.g., blocks Lighthouse with Prysm validator).
3. **Defaults**: Applies JSON schema defaults (e.g., numbers, enums, or interpolated strings like `{HOME}/ethereum/{common.network.name}`, where `{common.network.name}` is replaced by values like `mainnet`).
4. **Mappings**: Maps standard schema settings to client-specific flags (e.g., `reth-cmd-mappings.yaml`), often with minimal or no transformation, extensible for new versions or flags.
5. **Transformers**: Formats values for client compatibility when needed (e.g., `joinComma` for arrays, `interpolate` for strings like `{HOME}/ethereum/{common.network.name}`).

Example mapping:
```yaml
- configPath: execution.http.modules
  flag: --http.api
  transform: joinComma
  parent: --http
```

Example preset:
```yaml
common:
  dataDir: "{HOME}/ethereum/{common.network.name}"
  network: mainnet
  engine:
    port: 8551
    jwtFile: "{HOME}/ethereum/jwt.hex"
```

## To-Do

- [ ] Generate environment files for each client, requiring specific env mappings.
- [ ] Generate configuration files for each client, requiring specific config mappings.
- [ ] Import existing node configurations and create config files aligned with a preset.

## Requirements

- npm or yarn

## License

"Licensed under Apache 2.0, see LICENSE file.
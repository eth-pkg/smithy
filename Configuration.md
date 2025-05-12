# Smithy Configuration System

## Overview

Smithy uses a flexible and modular configuration system that allows users to customize their node setup through presets and individual configurations. The system is designed to be both powerful for advanced users and approachable for beginners.

## Configuration Structure

The configuration schema is organized into four main sections, each handling different aspects of the node setup:

### 1. Common Configuration
```yaml
common:
  # Basic Settings
  acceptTermsOfUse: false
  dataDir: "{HOME}/{common.network}"
  
  # Network Settings
  network:
    id: 1  # Network ID (1 for mainnet, 11155111 for sepolia, etc.)
    name: "mainnet"  # One of: mainnet, sepolia, holesky, hoodi, ephemery, custom
  
  # Engine API Settings
  engine:
    enabled: true
    communication:
      method: "jwt"  # One of: jwt, ipc
      jwt:
        file: "{common.dataDir}/{common.network.name}/engine.jwt"
        id: ""
      ipc:
        path: "{common.dataDir}/{common.network.name}/engine.ipc"
    api:
      port: 8551  # Port number for the Engine API (1024-65535)
      url: "{common.engine.api.scheme}://{common.engine.api.host}:{common.engine.api.port}"
      host: "localhost"
      allowlist: ["localhost"]
      ip: "127.0.0.1"
      scheme: "http"  # One of: http, https
  
  # System Settings
  operatingSystem: "linux"  # One of: linux, darwin, windows
```

### 2. Execution Client Configuration
```yaml
execution:
  # Client Selection
  client:
    name: ""  # Required, one of: besu, erigon, geth, nethermind, reth
    version: ""  # Optional, semver string
  
  isExternal: true  # Whether the execution client is external to the node
  
  # P2P Settings
  p2p:
    address: "localhost"
    port: 30303
    dnsDiscovery:
      enabled: true
      url: ""
    discovery:
      enabled: true
      port: 30303
      v4:
        enabled: true
        port: 30303
        address: "localhost"
      v5:
        enabled: true
        port: 30303
        address: "localhost"
    nat:
      mode: "any"  # One of: any, none, upnp, pmp, extip, listen
      enabled: true
    identity: ""
    maxPeers: 50
    bootnodes: []
    enrAddress: ""
    udpPort: 30303
    relayNode: ""
    allowlist: ["*"]
    denylist: []
  
  # HTTP API Settings
  http:
    enabled: false
    modules: ["eth", "net", "web3"]
    address: "localhost"
    allowlist: ["*"]
    port: 8545
    tls:
      enabled: false
      certificate:
        cert: ""
        key: ""
      keystore:
        path: ""
        password: ""
      truststore:
        path: ""
        password: ""
      clientAuth:
        enabled: false
        caClientsEnabled: false
        path: ""
      cipherSuites: []
      protocol: "TLS"  # One of: TLS, TLSv1.3
  
  # Metrics Settings
  metrics:
    enabled: false
    port: 6060
    address: "localhost"
  
  # WebSocket Settings
  ws:
    enabled: false
    port: 8546
    address: "localhost"
    modules: ["eth", "net", "web3"]
    allowlist: ["*"]
  
  # Logging Settings
  logging:
    stdout:
      enabled: false
      level: "info"  # One of: off, error, warn, info, debug, trace, all
      format: "text"
      color: true
    file:
      enabled: false
      directory: "{common.dataDir}/logs"
      level: "info"
      format: "text"
      name: "{execution.client.name}.log"
      fullPath: "{execution.logging.file.directory}/{execution.logging.file.name}"
  
  # GraphQL Settings
  graphql:
    enabled: false
    address: "localhost"
    port: 8547
    allowlist: []
  
  # Transaction Pool Settings
  txpool:
    enabled: false
    blobPriceBump: 100
    disableLocals: false
    enableSaveRestore: false
    layerMaxCapacity: 25000000
    limitByAccountPercentage: 0.001
    maxFutureBySender: 200
    maxPrioritized: 4000
    maxPrioritizedByType:
      BLOB: 9
    minGasPrice: "0x3e8"
    minScore: -128
    priceBump: 10
    prioritySenders: []
    retentionHours: 13
    saveFile: "txpool.dump"
  
  # Beacon Settings
  beacon:
    enabled: false
  
  # Pruning Settings
  pruning:
    enabled: false
  
  # Data Directory
  dataDir: "{common.dataDir}/{execution.client.name}"
  
  # Gas Price Oracle Settings
  gpo:
    enabled: false
    blocks: 100
    maxPrice: 500000000000
    ignorePrice: 2
    percentile: 50.0
```

### 3. Consensus Client Configuration
```yaml
consensus:
  # Client Selection
  client:
    name: ""  # Required, one of: lighthouse, lodestar, nimbus-eth2, prysm, teku
    version: ""  # Optional, semver string
  
  # HTTP API Settings
  http:
    enabled: false
    api: ["eth", "net", "web3"]  # List of JSON-RPC API namespaces to enable
    address: "localhost"
    allowlist: ["*"]  # List of allowed CORS origins
    port: 8545  # Port number for HTTP JSON-RPC API (1024-65535)
  
  # Metrics Settings
  metrics:
    enabled: false
    host: "127.0.0.1"
    port: 8008  # Port number for metrics server (1024-65535)
  
  # P2P Settings
  p2p:
    enabled: true
    port: 9000  # Port number for P2P networking (1024-65535)
    port6: 9000  # IPv6 P2P port number (0 to disable IPv6)
    udpPort: 9000  # Port number for P2P networking (1024-65535)
    bootnodes: []  # List of bootnode enode URLs for initial peer discovery
    enrAddress: ""  # ENR (Ethereum Node Record) address to advertise
  
  # Checkpoint Sync Settings
  checkpointSync:
    enabled: false
    url: ""  # URL of a trusted beacon node for checkpoint sync
    state: ""  # State root hash to use for checkpoint sync
    ignoreWeakSubjectivityPeriod: false
    force: false  # Force checkpoint sync from weak subjectivity
    wss: ""  # Weak subjectivity checkpoint in <blockRoot>:<epoch> format
  
  # Genesis Sync Settings
  genesisSync:
    enabled: false
    state: ""  # Path to genesis state file
    url: ""  # URL of a trusted beacon node for genesis sync
  
  # Graffiti Settings
  graffiti:
    enabled: false
    message: ""  # Custom graffiti message to include in proposed blocks
    file: ""  # Path to file containing graffiti messages
  
  # Logging Settings
  logging:
    enabled: false
    file: ""  # Path to store consensus client logs
    format: "auto"  # One of: auto, json, plain
  
  # Additional Settings
  testnetDir: ""  # Path to testnet configuration directory
  validatorMonitorFile: ""  # Path to file for validator monitoring data
  
  # Builder Settings
  builder:
    enabled: false  # Enable block builder API for MEV
    url: ""  # URL for the block builder API
  
  # Data Directory
  dataDir: "{common.dataDir}/{consensus.client.name}"  # Base directory for consensus client data
```

### 4. Validator Configuration
```yaml
validator:
  # Basic Settings
  enabled: false
  isExternal: true
  client:
    name: ""  # Required when staking is enabled, one of: lighthouse, lodestar, nimbus-eth2, prysm, teku
    version: ""  # Optional, semver string
  
  # Data and Connection Settings
  dataDir: "{common.dataDir}/{validator.client.name}-validator"
  beaconRpcProvider: "localhost:5052"
  numValidators: 1
  feeRecipientAddress: "0x0000000000000000000000000000000000000000"
  
  # Metrics Settings
  metrics:
    enabled: false
    host: "127.0.0.1"
    port: null
  
  # Graffiti Settings
  graffiti:
    enabled: false
    message: ""
    file: ""
  
  # Validator Settings
  suggestedGasLimit: 30000000
  doppelgangerProtection: true
  builderEnabled: false
  
  # External Signer Settings
  externalSigner:
    enabled: false
    url: ""
    keystore: ""
    keystorePasswordFile: ""
    publicKeys: []
    timeout: 5000
    truststore: ""
    truststorePasswordFile: ""
  
  # Proposer Settings
  proposerConfig:
    enabled: false
    file: ""
    refreshEnabled: false
    blindedBlocksEnabled: false
    refreshInterval: 0
    maxValidators: 1000000
    maxProposerDelay: 0
  
  # Directory Settings
  validatorsDir: "$HOME/ethereum/validator/keys"
  secretsDir: "$HOME/ethereum/validator/secrets"
  distributed: false
```

## Preset System

Smithy uses a preset-based configuration system that allows for easy customization and sharing of configurations. All presets are essentially feature presets that enforce specific rules and configurations:

1. **Base Preset**: `default.yml` serves as the foundation with default values for all settings.

2. **Feature Presets**: Define and enforce specific rules for node operation. These can be categorized as:

   a. **Network Feature Presets**:
   - Define which network the node operates on
   - Enforce network-specific rules and requirements
   - Examples:
     ```yaml
     $id: sepolia.yml
     allOf:
       - $ref: ./default.yml
     
     # Network-specific rules
     common:
       network:
         id: 11155111
         name: "sepolia"
         required: true  # Cannot be changed
       dataDir: "{HOME}/{common.network.name}"  # Interpolated path
     
     # Enforce testnet-specific client requirements
     execution:
       client:
         name:
           enum: ["geth", "besu", "nethermind"]  # Only these clients support Sepolia
         testnet: true  # Force testnet mode
       p2p:
         bootnodes: [
           "enode://...",  # Sepolia-specific bootnodes
           "enode://..."
         ]
     ```

   b. **Node Type Feature Presets**:
   - Define the type of node operation
   - Examples:
     - Staker: Enforces validator client and staking settings
     - Non-Staker: Prohibits validator settings
     ```yaml
     $id: staker.yml
     allOf:
       - $ref: ./default.yml
     
     # Enforce staking requirements
     validator:
       required: true
       client:
         required: true
         name:
           enum: ["lighthouse", "lodestar", "nimbus-eth2", "prysm", "teku"]
       dataDir: "{common.dataDir}/{validator.client.name}-validator"  # Interpolated path
     ```

   c. **Functionality Feature Presets**:
   - Define specific node functionalities
   - Can be combined with other feature presets
   - Examples:
     - Monitoring: Metrics, logging, GraphQL
     - Security: TLS, authentication
     - Performance: Caching, pruning
     ```yaml
     $id: monitoring.yml
     allOf:
       - $ref: ./default.yml
     
     # Enforce monitoring requirements
     metrics:
       enabled: true
       required: true
       dataDir: "{common.dataDir}/metrics"  # Interpolated path
     logging:
       stdout:
         enabled: true
         required: true
       file:
         enabled: true
         required: true
         directory: "{common.dataDir}/logs"  # Interpolated path
     graphql:
       enabled: true
       required: true
     ```

3. **Combined Presets**: Merge multiple feature presets to create complete node configurations:
   ```yaml
   $id: mainnet-staker-monitoring.yml
   allOf:
     - $ref: ./default.yml
     - $ref: ./features/networks/mainnet.yml  # Network feature preset
     - $ref: ./features/node-types/staker.yml  # Node type feature preset
     - $ref: ./features/functionality/monitoring.yml  # Functionality feature preset
   ```

## Validation Rules

Presets include comprehensive validation rules that ensure compatibility between different settings and provide appropriate warnings or errors:

1. **Client Compatibility**:
   ```yaml
   # Example of client-specific validation rules
   execution:
     client:
       name:
         enum: ["geth", "besu", "nethermind", "reth"]
     communication:
       method:
         enum: ["jwt", "ipc"]
         # Validation rule: IPC only supported by certain clients
         if:
           client.name: ["geth", "besu"]
         then:
           method: ["jwt", "ipc"]
         else:
           method: ["jwt"]
         errorMessage: "IPC communication is only supported by Geth and Besu clients"
   ```

2. **Feature Compatibility**:
   ```yaml
   # Example of feature compatibility rules
   consensus:
     client:
       name:
         enum: ["lighthouse", "prysm", "teku"]
     builder:
       enabled: true
       # Validation rule: Builder API support varies by client
       if:
         client.name: ["lighthouse", "prysm"]
       then:
         enabled: true
       else:
         enabled: false
       warningMessage: "Builder API is not fully supported by this client"
   ```

3. **Network Compatibility**:
   ```yaml
   # Example of network-specific validation
   common:
     network:
       name:
         enum: ["mainnet", "sepolia", "holesky"]
     engine:
       api:
         # Validation rule: Different ports for different networks
         port:
           if:
             network.name: "mainnet"
           then:
             enum: [8551]
           else:
             enum: [8551, 8552]
           errorMessage: "Invalid port for selected network"
   ```

4. **Work in Progress Features**:
   ```yaml
   # Example of WIP feature warning
   execution:
     client:
       name: "reth"
     experimental:
       enabled: true
       warningMessage: "This feature is experimental and may not be stable"
   ```

### Validation Types

1. **Errors**: Prevent invalid configurations
   - Incompatible client combinations
   - Unsupported features for selected clients
   - Invalid network settings

2. **Warnings**: Alert about potential issues
   - Experimental features
   - Work in progress functionality
   - Deprecated settings

3. **Compatibility Checks**:
   - Client feature support
   - Network-specific requirements
   - Communication method compatibility
   - Builder API support

### Benefits of Validation Rules

- **Prevent Misconfigurations**: Catch invalid combinations before deployment
- **Clear Error Messages**: Explain why a configuration is invalid
- **Feature Awareness**: Warn about experimental or WIP features
- **Client Compatibility**: Ensure selected clients work together
- **Network Compliance**: Enforce network-specific requirements

## String Interpolation

String interpolation in presets provides a simple but powerful way to reference and reuse values from other parts of the configuration. This helps prevent errors and allows for dynamic value resolution without knowing the actual values in advance.

The interpolation syntax `{path.to.value}` can be used in any string value, but it's optional - regular strings work just as well when interpolation isn't needed.

### Why Use String Interpolation?

1. **Error Prevention**:
   ```yaml
   # Without interpolation - prone to errors if network name changes
   common:
     network:
       name: "mainnet"
     dataDir: "/home/user/ethereum/mainnet"  # Hardcoded value
   
   # With interpolation - automatically updates if network changes
   common:
     network:
       name: "mainnet"
     dataDir: "{HOME}/ethereum/{common.network.name}"  # Dynamic value
   ```

2. **Value Reuse**:
   ```yaml
   # Reusing the same value in multiple places
   common:
     dataDir: "{HOME}/ethereum/{common.network.name}"
   execution:
     dataDir: "{common.dataDir}/{execution.client.name}"
   consensus:
     dataDir: "{common.dataDir}/{consensus.client.name}"
   validator:
     dataDir: "{common.dataDir}/{validator.client.name}-validator"
   ```

3. **Dynamic Resolution**:
   ```yaml
   # The actual values are resolved at runtime
   engine:
     communication:
       jwt:
         file: "{common.dataDir}/{common.network.name}/engine.jwt"
       ipc:
         path: "{common.dataDir}/{common.network.name}/engine.ipc"
     api:
       url: "{common.engine.api.scheme}://{common.engine.api.host}:{common.engine.api.port}"
   ```

4. **Environment Awareness**:
   ```yaml
   # Using environment variables
   common:
     dataDir: "{HOME}/ethereum/{common.network.name}"
     configDir: "{XDG_CONFIG_HOME}/smithy"
   ```

### When to Use String Interpolation

1. **Use interpolation when**:
   - You need to reference values that might change
   - You want to ensure consistency across the configuration
   - You need to build paths or URLs dynamically
   - You want to reuse values in multiple places

2. **Use regular strings when**:
   - The value is static and won't change
   - The value doesn't depend on other settings
   - The value is specific to a single component
   ```yaml
   # Static values don't need interpolation
   metrics:
     port: 6060
     host: "localhost"
   logging:
     level: "info"
     format: "text"
   ```

### Benefits

- **Consistency**: Ensures values are consistent across the configuration
- **Maintainability**: Changes to referenced values automatically propagate
- **Flexibility**: Works with both static and dynamic values
- **Simplicity**: No custom code needed, just simple string interpolation
- **Error Prevention**: Reduces the chance of mismatched values

## Presets vs Configuration Files

Presets and configuration files serve different purposes:

1. **Presets**:
   - Define and enforce rules for node operation
   - Can be network-specific, node-type-specific, or functionality-specific
   - Allow sharing of node configurations with others
   - Can be created by anyone to define how a node should operate
   - Can be combined to create complete node configurations

2. **Configuration Files**:
   - Provide specific values for settings defined in the preset
   - Cannot override preset validation rules
   - Allow customization of non-restricted settings (ports, data directories, etc.)
   - Enable reuse of presets with different values

Example of a staker preset with validation rules:
```yaml
$id: staker-preset.yml
allOf:
  - $ref: ./default.yml
  - $ref: ./networks/mainnet.yml
  - $ref: ./features/staker.yml

# Enforce validator client selection
validator:
  required: true
  client:
    required: true
    name:
      enum: ["lighthouse", "lodestar", "nimbus-eth2", "prysm", "teku"]
```

Example of a non-staker preset with validation rules:
```yaml
$id: non-staker-preset.yml
allOf:
  - $ref: ./default.yml
  - $ref: ./networks/mainnet.yml
  - $ref: ./features/non-staker.yml

# Prohibit validator settings
validator:
  enabled: false
  client:
    name: null
```

## Creating Custom Configurations

Users can create their own configurations in two ways:

1. **Preset-based**: Create a new preset that extends the default configuration and defines validation rules:
```yaml
$id: custom-preset.yml
allOf:
  - $ref: ./default.yml
  - $ref: ./networks/mainnet.yml
  - $ref: ./features/staker.yml

# Custom validation rules
execution:
  client:
    name:
      enum: ["geth", "besu"]  # Restrict to specific clients
  http:
    enabled: true  # Force HTTP API to be enabled
```

2. **Configuration File**: Create a configuration file that provides values for a selected preset:
```yaml
# Using mainnet-staker preset with custom values
common:
  dataDir: "/custom/path/to/data"
execution:
  client:
    name: "geth"
  http:
    port: 8545
consensus:
  client:
    name: "lighthouse"
validator:
  client:
    name: "lighthouse"
  feeRecipientAddress: "0x123..."
```

## Configuration Loading

The configuration system is flexible and allows users to:

1. **Select a Preset**: Users can choose any available preset (e.g., mainnet-staker, holesky-non-staker) as their base configuration. The default preset only requires client selection.

2. **Override Settings**: Users can override any settings from the selected preset through:
   - Command line arguments (e.g., for staking/non-staking mode)
   - Configuration files

3. **Client Selection**: The minimum requirement for the default preset is selecting the execution and consensus clients. For staking, a validator client must also be selected.

4. **Staking Mode**: The staking mode (staking/non-staking) can be defined either:
   - In the configuration file
   - Through command line arguments
   - Through the selected preset (if using a staker/non-staker preset)

Note: Configuration files cannot override the validation rules defined in the selected preset. For example, a staker preset will always require a validator client, and a non-staker preset will always prohibit validator settings.

For detailed schema definitions and validation rules, please refer to the preset files in the `data/presets` directory.


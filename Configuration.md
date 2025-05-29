# Smithy Configuration System

## Overview

Smithy uses a flexible and modular configuration system that allows users to customize their node setup through presets and individual configurations. The system is designed to be both powerful for advanced users and approachable for beginners.

## Configuration Structure

The configuration schema is organized into four main sections, each handling different aspects of the node setup:

### 1. Common Configuration
```yaml
common:
  # Basic Settings
  acceptTermsOfUse: false  # Accept the terms of use
  dataDir: "/home/user/{common.network.name}"  # Base directory for storing Ethereum client data
  
  # Network Settings
  network:
    id: 1  # The Ethereum network ID (1 for mainnet, 11155111 for sepolia, etc.)
    name: "mainnet"  # One of: mainnet, sepolia, holesky, hoodi, ephemery, custom
  
  # Engine API Settings
  engine:
    jwt:
      file: "{common.dataDir}/{common.network.name}/engine.jwt"  # Path to the JWT secret file for Engine API
      id: ""  # JWT claims id for client identification
    api:
      port: 8551  # Port number for the Engine API (1024-65535)
      urls: ["{common.engine.api.scheme}://{common.engine.api.host}:{common.engine.api.port}"]  # List of Engine API endpoints
      host: "localhost"  # Hostname for the Engine API
      allowlist: ["localhost"]  # Allowed hostnames for the Engine API
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
    address: "localhost"  # Network interface to listen on
    port: 30303  # Port number for P2P networking (1024-65535)
    dnsDiscovery:
      enabled: true  # Enable DNS discovery
      url: ""  # URL for DNS discovery
    discovery:
      enabled: true  # Enable discovery
      port: 30303  # Port number for discovery
      v4:
        enabled: true  # Enable discovery v4
      v5:
        enabled: true  # Enable discovery v5
    nat:
      mode: "any"  # One of: any, none, upnp, pmp, stun, extip:<IP>
      enabled: true  # Enable NAT configuration
    identity: ""  # Identity of the node
    maxPeers: 50  # Maximum number of P2P peers to connect to (1-1000)
    bootnodes: []  # List of bootnode enode URLs for initial peer discovery
    allowlist: ["*"]  # List of allowed CORS origins for P2P networking
    netrestrict: []  # The CIDR subnets for denying certain peer connections
  
  # HTTP API Settings
  http:
    enabled: false  # Enable HTTP JSON-RPC API
    modules: ["eth", "net", "web3"]  # List of JSON-RPC API namespaces to enable
    address: "localhost"  # Address to listen on
    allowlist: ["*"]  # List of allowed CORS origins for HTTP API
    port: 8545  # Port number for HTTP JSON-RPC API (1024-65535)
  
  # Metrics Settings
  metrics:
    enabled: false  # Enable metrics collection and reporting
    port: 6060  # Port number for metrics server (1024-65535)
    address: "localhost"  # Address to listen on for metrics server
  
  # WebSocket Settings
  ws:
    enabled: false  # Enable WebSocket JSON-RPC API
    port: 8546  # Port number for WebSocket JSON-RPC API (1024-65535)
    address: "localhost"  # Address to listen on for WebSocket JSON-RPC API
    modules: ["eth", "net", "web3"]  # List of JSON-RPC API namespaces to enable
    allowlist: ["*"]  # List of allowed CORS origins for WebSocket JSON-RPC API
  
  # Logging Settings
  logging:
    console:
      enabled: false  # Enable console logging
      level: "info"  # One of: off, error, warn, info, debug, trace, all
      format: "text"  # Logging format
      color: true  # Enable colorized logging
    file:
      enabled: false  # Enable file logging
      directory: "{common.dataDir}/logs"  # Directory to write logs to
      level: "info"  # Logging level
      format: "text"  # Logging format
      name: "{execution.client.name}.log"  # Name of the log file
      fullPath: "{execution.logging.file.directory}/{execution.logging.file.name}"  # Full path to the log file
  
  # GraphQL Settings
  graphql:
    enabled: false  # Enable GraphQL HTTP service
    address: "localhost"  # Host for GraphQL HTTP to listen on
    port: 8547  # Port for GraphQL HTTP to listen on (1024-65535)
    allowlist: []  # Comma separated origin domain URLs for CORS validation
  
  # Transaction Pool Settings
  txpool:
    enabled: false  # Enable transaction pool
  
  # Beacon Settings
  beacon:
    enabled: false  # Enable beacon
  
  # Pruning Settings
  pruning:
    enabled: false  # Enable pruning
  
  # Data Directory
  dataDir: "{common.dataDir}/{execution.client.name}"  # Base directory for execution client data
  
  # Gas Price Oracle Settings
  gpo:
    enabled: false  # Enable gas price oracle
    blocks: 100  # Number of blocks to consider for eth_gasPrice
    maxPrice: 500000000000  # Maximum gas price for eth_gasPrice
    ignorePrice: 2  # Gas Price below which gpo will ignore transactions
    percentile: 50.0  # Percentile value to measure for eth_gasPrice
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
    enabled: false  # Enable HTTP JSON-RPC API
    api: ["eth", "net", "web3"]  # List of JSON-RPC API namespaces to enable
    address: "localhost"  # Address to listen on
    allowlist: ["*"]  # List of allowed CORS origins for HTTP API
    port: 8545  # Port number for HTTP JSON-RPC API (1024-65535)
  
  # Metrics Settings
  metrics:
    enabled: false  # Enable metrics collection and reporting
    host: "127.0.0.1"  # IP address to bind the metrics server to
    port: 8008  # Port number for metrics server of the consensus client (1024-65535)
  
  # P2P Settings
  p2p:
    enabled: true  # Enable P2P networking of the consensus client
    port: 9000  # Port number for P2P UDP and TCP (1024-65535)
    port6: 9000  # IPv6 P2P port number (1024-65535)
    discoveryPort: 9002  # Discovery P2P port number (1024-65535)
    discoveryPort6: 9002  # Discovery P2P port number (1024-65535)
    bootnodes: []  # List of bootnode enode URLs for initial peer discovery
    staticPeers: []  # List of static peers to connect to
    trustedPeers: []  # List of trusted peers to connect to
    targetPeers: 25  # Target number of peers to connect to
    maxPeers: 25  # Maximum number of peers to connect to
    nodiscover: false  # Disable peer discovery
    listenAddress: ""  # Listen address for P2P networking
    localPeerDiscovery: false  # Enable local peer discovery
    subscribeAllSubnets: false  # Subscribe to all subnets
    upnp: false  # Enable UPnP
    staticId: ""  # Static ID for the node
  
  # Checkpoint Sync Settings
  checkpointSync:
    enabled: false  # Enable checkpoint sync
    url: ""  # URL of a trusted beacon node for checkpoint sync
    state: ""  # State root hash to use for checkpoint sync
    ignoreWeakSubjectivityPeriod: false  # Ignore weak subjectivity period
    force: false  # Force checkpoint sync from weak subjectivity
    wss: ""  # Weak subjectivity checkpoint in <blockRoot>:<epoch> format for sync starting point
  
  # Genesis Sync Settings
  genesisSync:
    enabled: false  # Enable genesis sync
    state: ""  # Path to genesis state file
    url: ""  # URL of a trusted beacon node for genesis sync
  
  # Logging Settings
  logging:
    enabled: false  # Enable logging of the consensus client
    file: ""  # Path to store consensus client logs
    format: "auto"  # One of: auto, json, plain
  
  # Additional Settings
  testnetDir: ""  # Path to testnet configuration directory
  
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
  enabled: false  # Enable validator functionality
  isExternal: true  # Is the validator external to the node, in different process
  client:
    name: ""  # Required when staking is enabled, one of: lighthouse, lodestar, nimbus-eth2, prysm, teku
    version: ""  # Optional, semver string
  
  # Data and Connection Settings
  dataDir: "{common.dataDir}/{validator.client.name}-validator"  # Base directory for validator data
  beaconNodes: ["localhost:5052"]  # Beacon node RPC endpoint(s) (host:port)
  suggestFeeRecipientAddress: "0x0000000000000000000000000000000000000000"  # Ethereum address to receive transaction fees
  
  # Metrics Settings
  metrics:
    enabled: false  # Enable validator metrics collection
    host: "127.0.0.1"  # IP address to bind the metrics server to
    port: null  # Port number for metrics server (1024-65535)
  
  # Graffiti Settings
  graffiti:
    enabled: false  # Enable graffiti on proposed blocks
    message: ""  # Custom graffiti message to include in proposed blocks
    file: ""  # Path to file containing graffiti messages
  
  # Validator Settings
  suggestedGasLimit: 30000000  # Suggested gas limit for proposed blocks
  doppelgangerProtection: true  # Enable protection against duplicate validator instances
  builderEnabled: false  # Enable block builder API for MEV
  
  # External Signer Settings
  externalSigner:
    enabled: false  # Enable external signer
    url: ""  # URL for external signer service
    keystore: ""  # Path to external signer keystore
    keystorePasswordFile: ""  # Path to file containing external signer keystore password
    publicKeys: []  # List of public keys for external signer
    timeout: 5000  # Timeout for external signer requests
    truststore: ""  # Path to external signer truststore
    truststorePasswordFile: ""  # Path to file containing external signer truststore password
  
  # Proposer Settings
  proposerConfig:
    enabled: false  # Enable proposer configuration
    file: ""  # Path to proposer configuration file
    refreshEnabled: false  # Enable automatic refresh of proposer configuration
    blindedBlocksEnabled: false  # Enable blinded blocks
    refreshInterval: 0  # Interval in seconds to refresh proposer configuration
    maxValidators: 1000000  # Maximum number of validators to support
    maxProposerDelay: 0  # Maximum delay in seconds for proposer duties
  
  # Directory Settings
  validatorsDir: "$HOME/ethereum/validator/keys"  # Directory containing validator keys
  secretsDir: "$HOME/ethereum/validator/secrets"  # Directory containing validator secrets
  distributed: false  # Enable distributed validator mode
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
       dataDir: "/home/user/{common.network.name}"  # Interpolated path
     
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
       console:
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
     engine:
       jwt:
         required: true
         file: "{common.dataDir}/{common.network.name}/engine.jwt"
         errorMessage: "JWT file is required for Engine API authentication"
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
     dataDir: "/home/user/ethereum/{common.network.name}"  # Dynamic value
   ```

2. **Value Reuse**:
   ```yaml
   # Reusing the same value in multiple places
   common:
     dataDir: "/home/user/ethereum/{common.network.name}"
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
     dataDir: "/home/user/ethereum/{common.network.name}"
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
  suggestFeeRecipientAddress: "0x123..."
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


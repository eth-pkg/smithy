# Smithy

A CLI tool for generating Ethereum client configurations, built with TypeScript.

## Installation

```bash
# Install globally
npm install -g smithy

# Or install as a dependency
npm install --save smithy
```

## Usage

### Command Line

```bash
# Generate configurations interactively
smithy generate

# Generate configurations with specific clients
smithy generate --execution geth --consensus lighthouse --validator lighthouse

# Use a specific preset
smithy generate --preset default --execution nethermind --consensus prysm

# Specify output directory
smithy generate --output ./my-configs

# Enable verbose logging
smithy generate --verbose
```

### List available presets

```bash
smithy presets
```

### Programmatic API

```typescript
import smithy from 'smithy';

async function run() {
  // Generate client configurations
  await smithy.generate({
    preset: 'default',
    execution: 'geth',
    consensus: 'lighthouse',
    validator: 'lighthouse',
    output: './my-configs'
  });
  
  // List available presets
  const presets = await smithy.listPresets();
  console.log('Available presets:', presets);
  
  // Get available clients by type
  const executionClients = smithy.getClientNames('execution');
  console.log('Available execution clients:', executionClients);
}

run().catch(console.error);
```

## Available Clients

### Execution Clients
- `geth`: Go Ethereum
- `nethermind`: Nethermind
- `besu`: Hyperledger Besu

### Consensus Clients
- `lighthouse`: Lighthouse
- `prysm`: Prysm
- `teku`: Teku

### Validator Clients
- `lighthouse`: Lighthouse Validator
- `prysm`: Prysm Validator
- `teku`: Teku Validator

## Configuration Presets

The default preset includes common configurations for Ethereum clients. You can create custom presets by adding YAML files to the `presets` directory.

Example preset structure:
```yaml
commonConfig:
  communication: jwt
  consensusClient: ''
  dataDir: $HOME/ethereum/mainnet
  engine:
    port: 8551
    endpointUrl: http://localhost:8551
    host: localhost
    ip: 127.0.0.1
    scheme: http
  executionClient: ''
  features:
    mevBoost: false
    monitoring: true
    staking: false
  jwtFile: $HOME/ethereum/jwt.hex
  network: mainnet
  operatingSystem: linux
  syncMode: snap
  validatorClient: ''

consensusConfig:
  httpPort: '5052'
  metricsPort: '8008'
  p2pPort: '9000'

executionConfig:
  http:
    apiPrefixes:
      - eth
      - net
      - web3
    cors:
      - '*'
    enabled: true
    port: '8545'
  metrics:
    enabled: true
    port: '6060'
  p2p:
    maxPeers: '50'
    port: '30303'
  ws:
    enabled: false
    port: '8546'
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Run in development mode
npm run dev
```

## License

MIT

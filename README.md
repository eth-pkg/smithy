# Smithy

A CLI tool for generating Ethereum client configurations, built with TypeScript.

## Installation

```bash
# Install globally
npm install -g smithy-cli

# Or install as a dev dependency
npm install --save-dev smithy-cli
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
import smithy from 'smithy-cli';

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

## Development

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

### Testing

The project uses Mocha and Chai for testing. Tests are organized into unit and integration tests.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- test/unit/preset.test.ts
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
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
type: object
required:
  - commonConfig
properties:
  commonConfig:
    type: object
    required:
      - clients
    properties:
      clients:
        type: object
        required:
          - consensus
          - execution
        properties:
          consensus:
            type: string
            enum:
              - lighthouse
              - prysm
              - teku
          execution:
            type: string
            enum:
              - geth
              - nethermind
              - besu
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Run the test suite
6. Submit a pull request

## License

MIT 
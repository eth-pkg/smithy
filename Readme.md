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
type: object
required:
  - commonConfig
properties:
  commonConfig:
    type: object
    properties:
      dataDir:
        type: string
      engine:
        type: object
        properties:
          enabled:
            type: boolean
          port:
            type: number
          communication:
            type: string
          url:
            type: string
          host:
            type: string
          hostAllowlist:
            type: string
          ip:
            type: string
          jwtFile:
            type: string
          scheme:
            type: string
          ipcPath:
            type: string
      network:
        type: string
      networkId:
        type: number
      operatingSystem:
        type: string
      syncMode:
        type: string
  executionConfig:
    type: object
    required: [client]
    properties:
      client:
        type: object
        required: [name]
        properties:
          name:
            type: string
          version:
            type: string
      http:
        type: object
        properties:
          apiPrefixes:
            type: array
            items:
              type: string
          cors:
            type: array
            items:
              type: string
          enabled:
            type: boolean
          port:
            type: number
      metrics:
        type: object
        properties:
          enabled:
            type: boolean
          port:
            type: number
      p2p:
        type: object
        properties:
          maxPeers:
            type: number
          port:
            type: number
      ws:
        type: object
        properties:
          enabled:
            type: boolean
          port:
            type: number
      dataDir:
        type: string
  consensusConfig:
    type: object
    required: [client]
    properties:
      client:
        type: object
        required: [name]
        properties:
          name:
            type: string
          version:
            type: string
      httpPort:
        type: number
      metricsPort:
        type: number
      p2pPort:
        type: number
      checkpointSyncUrl:
        type: string
      checkpointBlock:
        type: string
      checkpointState:
        type: string
      graffiti:
        type: string
      logFile:
        type: string
      logFormat:
        type: string
      metricsAddress:
        type: string
      monitoringEndpoint:
        type: string
      bootnodes:
        type: array
        items:
          type: string
      enrAddress:
        type: string
      port6:
        type: number
      discoveryPort:
        type: number
      testnetDir:
        type: string
      validatorMonitorFile:
        type: string
      builder:
        type: boolean
      dataDir:
        type: string
  validatorConfig:
    type: object
    properties:
      enabled:
        type: boolean
      client:
        type: object
        required: [name]
        properties:
          name:
            type: string
          version:
            type: string
      dataDir:
        type: string
      beaconRpcProvider:
        type: string
      numValidators:
        type: number
      feeRecipientAddress:
        type: string
      metricsPort:
        type: string
      graffiti:
        type: string
      graffitiFile:
        type: string
      proposerConfigFile:
        type: string
      suggestedGasLimit:
        type: number
      doppelgangerProtection:
        type: boolean
      builderEnabled:
        type: boolean
      externalSignerUrl:
        type: string
      externalSignerKeystore:
        type: string
      externalSignerKeystorePasswordFile:
        type: string
      externalSignerPublicKeys:
        type: array
        items:
          type: string
      externalSignerTimeout:
        type: number
      externalSignerTruststore:
        type: string
      externalSignerTruststorePasswordFile:
        type: string
      proposerBlindedBlocksEnabled:
        type: boolean
      proposerConfigRefreshEnabled:
        type: boolean
      metricsEnabled:
        type: boolean
      validatorsDir:
        type: string
      secretsDir:
        type: string
      distributed:
        type: boolean
```

## Supported Schema Fields

The following table indicates the current mapping status of schema fields to client-specific flags. Only `engine`, `dataDir`, and `client` names are currently mapped, with other fields as work in progress.


| Schema Section       | Field                                | Mapping Status       |
|----------------------|--------------------------------------|----------------------|
| commonConfig         | dataDir                              | Mapped               |
| commonConfig         | engine                               | Mapped               |
| commonConfig         | network                              | Mapped               |
| commonConfig         | networkId                            | Mapped               |
| commonConfig         | operatingSystem                      | Mapped               |
| commonConfig         | syncMode                             | Work in Progress     |
| executionConfig      | client.name                          | Mapped               |
| executionConfig      | client.version                       | Work in Progress     |
| executionConfig      | http                                 | Work in Progress     |
| executionConfig      | metrics                              | Work in Progress     |
| executionConfig      | p2p                                  | Work in Progress     |
| executionConfig      | ws                                   | Work in Progress     |
| executionConfig      | dataDir                              | Mapped               |
| consensusConfig      | client.name                          | Mapped               |
| consensusConfig      | client.version                       | Work in Progress     |
| consensusConfig      | httpPort                             | Work in Progress     |
| consensusConfig      | metricsPort                          | Work in Progress     |
| consensusConfig      | p2pPort                              | Work in Progress     |
| consensusConfig      | checkpointSyncUrl                    | Work in Progress     |
| consensusConfig      | checkpointBlock                      | Work in Progress     |
| consensusConfig      | checkpointState                      | Work in Progress     |
| consensusConfig      | graffiti                             | Work in Progress     |
| consensusConfig      | logFile                              | Work in Progress     |
| consensusConfig      | logFormat                            | Work in Progress     |
| consensusConfig      | metricsAddress                       | Work in Progress     |
| consensusConfig      | monitoringEndpoint                   | Work in Progress     |
| consensusConfig      | bootnodes                            | Work in Progress     |
| consensusConfig      | enrAddress                           | Work in Progress     |
| consensusConfig      | port6                                | Work in Progress     |
| consensusConfig      | discoveryPort                        | Work in Progress     |
| consensusConfig      | testnetDir                           | Work in Progress     |
| consensusConfig      | validatorMonitorFile                 | Work in Progress     |
| consensusConfig      | builder                              | Work in Progress     |
| consensusConfig      | dataDir                              | Mapped               |
| validatorConfig      | enabled                              | Mapped               |
| validatorConfig      | client.name                          | Mapped               |
| validatorConfig      | client.version                       | Work in Progress     |
| validatorConfig      | dataDir                              | Mapped               |
| validatorConfig      | beaconRpcProvider                    | Work in Progress     |
| validatorConfig      | numValidators                        | Work in Progress     |
| validatorConfig      | feeRecipientAddress                  | Work in Progress     |
| validatorConfig      | metricsPort                          | Work in Progress     |
| validatorConfig      | graffiti                             | Work in Progress     |
| validatorConfig      | graffitiFile                         | Work in Progress     |
| validatorConfig      | proposerConfigFile                   | Work in Progress     |
| validatorConfig      | suggestedGasLimit                    | Work in Progress     |
| validatorConfig      | doppelgangerProtection               | Work in Progress     |
| validatorConfig      | builderEnabled                       | Work in Progress     |
| validatorConfig      | externalSignerUrl                    | Work in Progress     |
| validatorConfig      | externalSignerKeystore               | Work in Progress     |
| validatorConfig      | externalSignerKeystorePasswordFile   | Work in Progress     |
| validatorConfig      | externalSignerPublicKeys             | Work in Progress     |
| validatorConfig      | externalSignerTimeout                | Work in Progress     |
| validatorConfig      | externalSignerTruststore             | Work in Progress     |
| validatorConfig      | externalSignerTruststorePasswordFile | Work in Progress     |
| validatorConfig      | proposerBlindedBlocksEnabled         | Work in Progress     |
| validatorConfig      | proposerConfigRefreshEnabled         | Work in Progress     |
| validatorConfig      | metricsEnabled                       | Work in Progress     |
| validatorConfig      | validatorsDir                        | Work in Progress     |
| validatorConfig      | secretsDir                           | Work in Progress     |
| validatorConfig      | distributed                          | Work in Progress     |
## How It Works

Smithy uses JSON schema-based presets with:
1. **Schema**: Defines standardized settings across clients (e.g., data directories, ports), requiring only JSON schema knowledge.
2. **Validation**: Enforces rules for network consistency, valid ports, and client compatibility (e.g., blocks Lighthouse with Prysm validator).
3. **Defaults**: Applies JSON schema defaults (e.g., numbers, enums, or interpolated strings like `{HOME}/ethereum/{commonConfig.network}`, where `{commonConfig.network}` is replaced by values like `mainnet`).
4. **Mappings**: Maps standard schema settings to client-specific flags (e.g., `reth-cmd-mappings.yaml`), often with minimal or no transformation, extensible for new versions or flags.
5. **Transformers**: Formats values for client compatibility when needed (e.g., `joinComma` for arrays, `interpolate` for strings like `{HOME}/ethereum/{commonConfig.network}`).

Example mapping:
```yaml
- configPath: executionConfig.http.apiPrefixes
  flag: --http.api
  transform: joinComma
  parent: --http
```

Example preset:
```yaml
commonConfig:
  dataDir: "{HOME}/ethereum/{commonConfig.network}"
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

MIT
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
  - common
properties:
  common:
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
  validator:
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
3. **Defaults**: Applies JSON schema defaults (e.g., numbers, enums, or interpolated strings like `{HOME}/ethereum/{common.network}`, where `{common.network}` is replaced by values like `mainnet`).
4. **Mappings**: Maps standard schema settings to client-specific flags (e.g., `reth-cmd-mappings.yaml`), often with minimal or no transformation, extensible for new versions or flags.
5. **Transformers**: Formats values for client compatibility when needed (e.g., `joinComma` for arrays, `interpolate` for strings like `{HOME}/ethereum/{common.network}`).

Example mapping:
```yaml
- configPath: execution.http.apiPrefixes
  flag: --http.api
  transform: joinComma
  parent: --http
```

Example preset:
```yaml
common:
  dataDir: "{HOME}/ethereum/{common.network}"
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
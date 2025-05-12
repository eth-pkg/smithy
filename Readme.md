# Smithy

## Overview

Smithy simplifies Ethereum client setup by generating precise command-line arguments for execution (e.g., Besu, Erigon, Geth, Nethermind, Reth), consensus (e.g., Lighthouse, Lodestar, ), and validator (e.g., Prysm) clients, with env and configuration file support planned. It reduces errors post-merge, where clients split into components with varying configuration requirements.

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
npm dev -- generate --execution geth --consensus lighthouse
```

Smithy delivers correct commands, saving time and preventing errors.

## Benefits

- **Automation**: Eliminates manual option/flag setup.
- **Accuracy**: Ensures compatible, correct arguments.
- **Flexibility**: Supports diverse client combinations.
- **Validation**: Instantly flags invalid settings.
- **Best Practices**: Applies secure, recommended defaults.

<!--
## Installation

```bash
npm install -g smithy
```
-->

## Development

To run Smithy in development mode:

```bash
# Clone the repository
git clone https://github.com/eth-pkg/smithy.git
cd smithy

# Install dependencies
npm install

# Run in development mode
npm run dev -- generate --execution geth --consensus lighthouse
```

The development mode uses `ts-node-dev` which provides hot-reloading, so any changes to the source code will automatically restart the application.

## Usage

Generate commands:
```bash
# Full node
npm run dev -- generate --execution geth --consensus lighthouse

# Validator node
npm run dev -- generate --execution geth --consensus lighthouse --validator lighthouse

# Alternative clients
npm run dev -- generate --execution nethermind --consensus prysm
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
  npm run dev -- generate --execution geth --consensus lighthouse
  ```

- **Saved Config**: Store settings for reuse:
  ```bash
  npm run dev -- generate --execution geth --consensus lighthouse --config-file my-config.yml
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

## How It Works

Smithy uses JSON schema-based presets with:
1. **Schema**: Defines standardized settings across clients (e.g., data directories, ports), requiring only JSON schema knowledge.
2. **Validation**: Enforces rules for network consistency, valid ports, and client compatibility (e.g., blocks Lighthouse with Prysm validator).
3. **Defaults**: Applies JSON schema defaults (e.g., numbers, enums, or interpolated strings like `/home/user/ethereum/{common.network.name}`, where `{common.network.name}` is replaced by values like `mainnet`).
4. **Mappings**: Maps standard schema settings to client-specific flags (e.g., `reth-cmd-mappings.yaml`), often with minimal or no transformation, extensible for new versions or flags.
5. **Transformers**: Formats values for client compatibility when needed (e.g., `joinComma` for arrays, `interpolate` for strings like `/home/user/ethereum/{common.network.name}`).

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
  dataDir: "/home/user/ethereum/{common.network.name}"
  network: mainnet
  engine:
    port: 8551
    jwtFile: "/home/user/ethereum/jwt.hex"
```

## To-Do

- [ ] Generate environment files for each client, requiring specific env mappings.
- [ ] Generate configuration files for each client, requiring specific config mappings.
- [ ] Import existing node configurations and create config files aligned with a preset.

## Requirements

- npm or yarn

## License

Licensed under Apache 2.0, see [LICENSE](License.md) file.
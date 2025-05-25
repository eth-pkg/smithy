# Validator Client Configuration Mappings

## Common Configuration Names

### Client Configuration

| Common Config Name       | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| validator.client.name    | Validator client implementation name                      |
| validator.client.version | Version of the validator client                           |
| validator.isExternal     | run validator client in seperate process, default (false) |

Mapped to the right process validator name, and version used internally to decide which flag to map, in case if newer version has newer flags, etc.

### Basic Configuration

| Common Config Name                   | Description                                             |
| ------------------------------------ | ------------------------------------------------------- |
| validator.enabled                    | Enable validator functionality                          |
| validator.isExternal                 | Is the validator external to the node                   |
| validator.dataDir                    | Base directory for validator data                       |
| validator.beaconNodes                | Beacon node RPC endpoints (host:port, host:port)        |
| validator.suggestFeeRecipientAddress | Ethereum address to receive transaction fees            |
| validator.validatorsDir              | Directory containing validator keys                     |
| validator.secretsDir                 | Directory containing validator secrets                  |
| validator.distributed                | Enable distributed validator mode                       |
| validator.suggestedGasLimit          | Suggested gas limit for proposed blocks                 |
| validator.doppelgangerProtection     | Enable protection against duplicate validator instances |

### Metrics Configuration

| Common Config Name        | Description                              |
| ------------------------- | ---------------------------------------- |
| validator.metrics.enabled | Enable metrics collection and reporting  |
| validator.metrics.host    | IP address to bind the metrics server to |
| validator.metrics.port    | Port number for metrics server           |

### Logging Configuration

| Common Config Name                | Description                     |
| --------------------------------- | ------------------------------- |
| validator.logging.enabled         | Enable logging                  |
| validator.logging.file.enabled    | Enable file logging             |
| validator.logging.file.format     |                                 |
| validator.logging.file.level      |                                 |
| validator.logging.console.enabled | Enable console logging          |
| validator.logging.console.color   | Enable coloring console logging |
| validator.logging.console.format  |                                 |
| validator.logging.console.level   |                                 |

### Graffiti Configuration

| Common Config Name         | Description                               |
| -------------------------- | ----------------------------------------- |
| validator.graffiti.enabled | Enable graffiti on proposed blocks        |
| validator.graffiti.message | Custom graffiti message                   |
| validator.graffiti.file    | Path to file containing graffiti messages |

### Proposer Configuration

| Common Config Name               | Description                         |
| -------------------------------- | ----------------------------------- |
| validator.proposerConfig.enabled | Enable proposer configuration       |
| validator.proposerConfig.file    | Path to proposer configuration file |

### External Signer Configuration

| Common Config Name                            | Description                             |
| --------------------------------------------- | --------------------------------------- |
| validator.externalSigner.enabled              | Enable external signer                  |
| validator.externalSigner.url                  | URL for external signer service         |
| validator.externalSigner.keystore             | Path to external signer keystore        |
| validator.externalSigner.keystorePasswordFile | Path to keystore password file          |
| validator.externalSigner.publicKeys           | List of public keys for external signer |
| validator.externalSigner.timeout              | Timeout for external signer requests    |

## Client-Specific Mappings

### Lighthouse

| Common Config Name                            | Lighthouse Setting                |
| --------------------------------------------- | --------------------------------- |
| validator.dataDir                             | `--datadir value`                 |
| validator.beaconNodes                         | `--beacon-nodes value`            |
| validator.suggestFeeRecipientAddress          | `--suggested-fee-recipient value` |
| validator.metrics.enabled                     | `--metrics`                       |
| validator.metrics.host                        | `--metrics-address value`         |
| validator.metrics.port                        | `--metrics-port value`            |
| validator.graffiti.enabled                    | enable graffiti                   |
| validator.graffiti.message                    | `--graffiti value`                |
| validator.graffiti.file                       | `--graffiti-file value`           |
| validator.proposerConfig.enabled              | there is proposer nodes           |
| validator.proposerConfig.file                 |                                   |
| validator.externalSigner.enabled              |                                   |
| validator.externalSigner.url                  |                                   |
| validator.externalSigner.keystore             |                                   |
| validator.externalSigner.keystorePasswordFile |                                   |
| validator.externalSigner.publicKeys           |                                   |
| validator.logging.enabled                     | Enable logging                    |
| validator.logging.file.enabled                | Enable file logging               |
| validator.logging.file.format                 | `--logfile-format value`          |
| validator.logging.file.level                  | `--logfile-debug-level value`     |
| validator.logging.file.path                   | `--logfile value`                 |
| validator.logging.console.enabled             | Enable console logging            |
| validator.logging.console.color=true          | `--log-color`                     |
| validator.logging.console.format              | `--log-format value`              |
| validator.logging.console.level               | `--debug-level value`             |
| validator.validatorsDir                       | `--validators-dir value`          |
| validator.secretsDir                          | `--secrets-dir value`             |
| validator.distributed                         | `--distributed`                   |
| validator.suggestedGasLimit                   | `--suggested-gas-limit value`     |
| validator.doppelgangerProtection              | `--enable-doppelganger-detection` |

### Lodestar

| Common Config Name                            | Lodestar Setting                  |
| --------------------------------------------- | --------------------------------- |
| validator.dataDir                             | `--dataDir value`                 |
| validator.beaconNodes                         | `--beaconNodes value`             |
| validator.suggestFeeRecipientAddress          | `--suggestedFeeRecipient value`   |
| validator.metrics.enabled                     | `--metrics`                       |
| validator.metrics.host                        | `--metrics.address value`         |
| validator.metrics.port                        | `--metrics.port value`            |
| validator.graffiti.enabled                    | enable graffiti                   |
| validator.graffiti.message                    | `--graffiti value`                |
| validator.graffiti.file                       | None                              |
| validator.proposerConfig.enabled              | override proposer settings        |
| validator.proposerConfig.file                 | `--proposerSettingsFile value`    |
| validator.externalSigner.enabled              | `--externalSigner.fetch`          |
| validator.externalSigner.url                  | `--externalSigner.url`            |
| validator.externalSigner.keystore             |                                   |
| validator.externalSigner.keystorePasswordFile |                                   |
| validator.externalSigner.publicKeys           | `--externalSigner.pubkeys`        |
| validator.logging.enabled                     | Enable logging                    |
| validator.logging.file.enabled                | Enable file logging               |
| validator.logging.file.format                 |                                   |
| validator.logging.file.level                  | `--logFileLevel value`            |
| validator.logging.file.path                   | `--logFile value`                 |
| validator.logging.console.enabled             | Enable console logging            |
| validator.logging.console.color               | None                              |
| validator.logging.console.format              | None                              |
| validator.logging.console.level               | `--logLevel value`                |
| validator.validatorsDir                       | `--importKeystores value`         |
| validator.secretsDir                          | `--importKeystoresPassword value` |
| validator.distributed                         | `--distributed`                   |
| validator.suggestedGasLimit                   | `--suggestedFeeRecipient value`   |
| validator.doppelgangerProtection              | `--doppelgangerProtection`        |

### Nimbus-eth2

| Common Config Name                            | Nimbus-eth2 Setting               |
| --------------------------------------------- | --------------------------------- |
| validator.dataDir                             | `--data-dir value`                |
| validator.beaconNodes                         | `--beacon-node value`             |
| validator.suggestFeeRecipientAddress          | `--suggested-fee-recipient value` |
| validator.metrics.enabled                     | `--metrics`                       |
| validator.metrics.host                        | `--metrics-address value`         |
| validator.metrics.port                        | `--metrics-port value`            |
| validator.graffiti.enabled                    | enable graffiti                   |
| validator.graffiti.message                    | `--graffiti value`                |
| validator.graffiti.file                       | None                              |
| validator.proposerConfig.enabled              | None                              |
| validator.proposerConfig.file                 | None                              |
| validator.externalSigner.enabled              |                                   |
| validator.externalSigner.url                  | `--external-signer-url value`     |
| validator.externalSigner.keystore             |                                   |
| validator.externalSigner.keystorePasswordFile |                                   |
| validator.externalSigner.publicKeys           |                                   |
| validator.logging.enabled                     | Enable logging                    |
| validator.logging.file.enabled                | Enable file logging               |
| validator.logging.file.format                 | None                              |
| validator.logging.file.level                  | `--log-level value`               |
| validator.logging.file.path                   | `--log-file value`                |
| validator.logging.console.enabled             | Enable console logging            |
| validator.logging.console.color               | Enable coloring console logging   |
| validator.logging.console.format              |                                   |
| validator.logging.console.level               |                                   |
| validator.validatorsDir                       | `--validators-dir`                |
| validator.secretsDir                          | `--secrets-dir`                   |
| validator.distributed                         | `--distributed`                   |
| validator.suggestedGasLimit                   | `--suggested-gas-limit value`     |
| validator.doppelgangerProtection              | `--doppelganger-detection`        |

### Prysm

| Common Config Name                            | Prysm Setting                     |
| --------------------------------------------- | --------------------------------- |
| validator.dataDir                             | `--datadir value`                 |
| validator.beaconNodes                         | `--beacon-rpc-provider value`     |
| validator.suggestFeeRecipientAddress          | `--suggested-fee-recipient value` |
| validator.metrics.enabled                     | enable monitoring                 |
| validator.metrics.host                        | `--monitoring-host value`         |
| validator.metrics.port                        | `--monitoring-port value`         |
| validator.graffiti.enabled                    | enable graffiti                   |
| validator.graffiti.message                    | `--graffiti value`                |
| validator.graffiti.file                       | `--graffiti-file value`           |
| validator.proposerConfig.enabled              | enable proposer settings file     |
| validator.proposerConfig.file                 | `--proposer-settings-file value`  |
| validator.externalSigner.enabled              | enable external signers           |
| validator.externalSigner.url                  | `--external-signer-url`           |
| validator.externalSigner.keystore             | `--external-signer-key-file`      |
| validator.externalSigner.keystorePasswordFile | None                              |
| validator.externalSigner.publicKeys           | `--external-signer-public-keys`   |
| validator.logging.enabled                     | Enable logging                    |
| validator.logging.file.enabled                | Enable file logging               |
| validator.logging.file.format                 | `--log-format value`              |
| validator.logging.file.level                  |                                   |
| validator.logging.file.path                   | `--log-file value`                |
| validator.logging.console.enabled             | Enable console logging            |
| validator.logging.console.color               | Enable coloring console logging   |
| validator.logging.console.format              |                                   |
| validator.logging.console.level               | `--verbosity value`               |
| validator.validatorsDir                       | `--wallet-dir value`              |
| validator.secretsDir                          | `--wallet-password-file value`    |
| validator.distributed                         | `--distributed`                   |
| validator.suggestedGasLimit                   | `--suggested-gas-limit value`     |
| validator.doppelgangerProtection              | `--enable-doppelganger`           |

### Teku

| Common Config Name                            | Teku Setting                                                |
| --------------------------------------------- | ----------------------------------------------------------- |
| validator.dataDir                             | ??                                                          |
| validator.beaconNodes                         | `--beacon-node-api-endpoint value`                          |
| validator.suggestFeeRecipientAddress          | `--validators-proposer-default-fee-recipient value`         |
| validator.metrics.enabled                     | `--metrics-enabled`                                         |
| validator.metrics.host                        | `--metrics-interface value`                                 |
| validator.metrics.port                        | `--metrics-port value`                                      |
| validator.graffiti.enabled                    | enable validator graffiti                                   |
| validator.graffiti.message                    | `--validators-graffiti value`                               |
| validator.graffiti.file                       | `--validators-graffiti-file value`                          |
| validator.proposerConfig.enabled              | enable proposer config                                      |
| validator.proposerConfig.file                 | `--validators-proposer-config value`                        |
| validator.externalSigner.enabled              | enable external signer                                      |
| validator.externalSigner.url                  | `--validators-external-signer-url value`                    |
| validator.externalSigner.keystore             | `--validators-external-signer-keystore value`               |
| validator.externalSigner.keystorePasswordFile | `--validators-external-signer-keystore-password-file value` |
| validator.externalSigner.publicKeys           | `--validators-external-signer-public-keys value`            |
| validator.logging.enabled                     | Enable logging `--log-destination (BOTH, CONSOLE, FILE)`    |
| validator.logging.file.enabled                | Enable file logging                                         |
| validator.logging.file.format                 | None                                                        |
| validator.logging.file.level                  | `--logging value`                                           |
| validator.logging.file.path                   | `--log-file value`                                          |
| validator.logging.console.enabled             | Enable console logging                                      |
| validator.logging.console.color               | `--log-color-enabled`                                       |
| validator.logging.console.format              | None                                                        |
| validator.logging.console.level               | Same as `--logging value`                                   |
| validator.validatorsDir                       | `--validators-keys value`                                   |
| validator.secretsDir                          | ??                                                          |
| validator.distributed                         | None                                                        |
| validator.suggestedGasLimit                   | ??                                                          |
| validator.doppelgangerProtection              | `--doppelganger-detection-enabled`                          |

## Notes

- Configuration values are mapped based on the most common usage patterns
- Some clients may have additional configuration options not shown here
- Default values are not shown in the tables but can be found in the validator.yml schema
- Network-specific settings may vary between clients

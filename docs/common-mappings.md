# Client Configuration Mappings

## Common Configuration Names

### Network Configuration

| Common Config Name  | Description        |
| ------------------- | ------------------ |
| common.network.id   | Network identifier |
| common.network.name | Network name       |

### Data Directory

| Common Config Name | Description         |
| ------------------ | ------------------- |
| common.dataDir     | Data directory path |

### Engine API Configuration

| Common Config Name          | Description                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------- |
| common.engine.api.port      | Engine API port (execution only except if interpolation used)                      |
| common.engine.api.host      | Engine API host (execution only except if interpolation used)                      |
| common.engine.api.allowlist | Allowed hostnames for the Engine API (execution only except if interpolation used) |
| common.engine.api.urls      | Consensus engineapi urls                                                           |
| common.engine.jwt.file      | JWT secret file path                                                               |
| common.engine.jwt.id        | JWT claims id for client identification                                            |

## Execution Clients

### Besu

| Common Config               | Besu Setting                    |
| --------------------------- | ------------------------------- |
| common.network.id           | `--network-id=value`            |
| common.network.name         | `--network=value`               |
| common.dataDir              | `--data-path=value`             |
| common.engine.api.port      | `--engine-rpc-port`             |
| common.engine.api.host      | None                            |
| common.engine.api.allowlist | `--engine-host-allowlist=value` |
| common.engine.jwt.file      | `--engine-jwt-secret=value`     |

### Erigon

| Common Config               | Erigon Setting           |
| --------------------------- | ------------------------ |
| common.network.id           | `--networkid value`      |
| common.network.name         | `--chain value`          |
| common.dataDir              | `--datadir value`        |
| common.engine.api.port      | `--authrpc.port value`   |
| common.engine.api.host      | `--authrpc.addr value`   |
| common.engine.api.allowlist | `--authrpc.vhosts value` |
| common.engine.jwt.file      | `--authrpc.jwtsecret`    |

### Geth

| Common Config                | Geth Setting                |
| ---------------------------- | --------------------------- |
| common.network.id            | `--networkid value`         |
| common.network.name=mainnet  | `--mainnet`                 |
| common.network.name=sepolia  | `--sepolia`                 |
| common.network.name=ephemery | `--ephemery`                |
| common.network.name=holesky  | `--holesky`                 |
| common.network.name=hoodi    | `--hoodi`                   |
| common.dataDir               | `--datadir value`           |
| common.engine.api.port       | `--authrpc.port value`      |
| common.engine.api.host       | `--authrpc.addr value`      |
| common.engine.api.allowlist  | `--authrpc.vhosts value`    |
| common.engine.jwt.file       | `--authrpc.jwtsecret value` |

### Nethermind

| Common Config               | Nethermind Setting                     |
| --------------------------- | -------------------------------------- |
| common.network.id           | None                                   |
| common.network.name         | `--config value`                       |
| common.dataDir              | `--datadir value`                      |
| common.engine.api.port      | `--JsonRpc.EnginePort value`           |
| common.engine.api.host      | `--JsonRpc.EngineHost value`           |
| common.engine.api.allowlist | `--JsonRpc.EngineEnabledModules value` |
| common.engine.jwt.file      | `--JsonRpc.JwtSecretFile value`        |

### Reth

| Common Config               | Reth Setting                |
| --------------------------- | --------------------------- |
| common.network.id           | None                        |
| common.network.name         | `--chain value`             |
| common.dataDir              | `--datadir value`           |
| common.engine.api.port      | `--authrpc.port value`      |
| common.engine.api.host      | `--authrpc.addr value`      |
| common.engine.api.allowlist | `--authrpc.vhosts value`    |
| common.engine.jwt.file      | `--authrpc.jwtsecret value` |

## Consensus Clients

### Lighthouse

| Common Config                           | Lighthouse Setting                    |
| --------------------------------------- | ------------------------------------- |
| common.network.id                       | None                                  |
| common.network.name                     | `--network value`                     |
| common.dataDir                          | `--datadir value`                     |
| common.engine.api.urls=[value1, value2] | `--execution-endpoint value1`         |
| common.engine.api.urls=[value1, value2] | `--execution-endpoint value2`         |
| common.engine.api.urls                  | `--execution-endpoint additionalUrls` |
| common.engine.jwt.file                  | `--execution-jwt value`               |
| common.engine.jwt.file                  | `--execution-jwt-id value`            |

### Lodestar

| Common Config                         | Lodestar Setting                 |
| ------------------------------------- | -------------------------------- |
| common.network.id                     | None                             |
| common.network.name                   | `--network value`                |
| common.dataDir                        | `--dataDir value`                |
| common.engine.api.url=[value1,value2] | `--execution.urls value1,value2` |
| common.engine.jwt.file                | `--jwtSecret value`              |
| common.engine.jwt.id                  | `--jwtId value`                  |

### Nimbus-eth2

| Common Config                         | Nimbus-eth2 Setting        |
| ------------------------------------- | -------------------------- |
| common.network.id                     | None                       |
| common.network.name                   | `--network value`          |
| common.dataDir                        | `--data-dir value`         |
| common.engine.api.url=[value1,value2] | `--web3-url value1,value2` |
| common.engine.jwt.file                | `--jwt-secret value`       |

### Prysm

| Common Config                         | Prysm Setting                 |
| ------------------------------------- | ----------------------------- |
| common.network.id                     | `--chain-id value`            |
| common.network.name=mainnet           | `--mainnet`                   |
| common.network.name=sepolia           | `--sepolia`                   |
| common.network.name=ephemery          | `--ephemery`                  |
| common.network.name=holesky           | `--holesky`                   |
| common.network.name=hoodi             | `--hoodi`                     |
| common.dataDir                        | `--datadir value`             |
| common.engine.api.url=[value1,value2] | `--execution-endpoint value1` |
| common.engine.api.url=[value1,value2] | `--execution-endpoint value2` |
| common.engine.jwt.file                | `--jwt-secret`                |
| common.engine.jwt.file                | `--jwt-id`                    |

### Teku

| Common Config                         | Teku Setting                 |
| ------------------------------------- | ---------------------------- |
| common.network.id                     | None                         |
| common.network.name                   | `--network=value`            |
| common.dataDir                        | `--data-path=value`          |
| common.engine.api.url=[value1,value2] | `--ee-endpoint=value1`       |
| common.engine.api.url=[value1,value2] | `--ee-endpoint=value2`       |
| common.engine.jwt.file                | `--ee-jwt-secret-file=value` |
| common.engine.jwt.id                  | `--ee-jwt-secret-id=value`   |

## Validator Clients

### Lighthouse

| Common Config                           | Lighthouse Setting                    |
| --------------------------------------- | ------------------------------------- |
| common.network.id                       | None                                  |
| common.network.name                     | `--network value`                     |
| common.dataDir                          | `--datadir value`                     |

### Lodestar

| Common Config                         | Lodestar Setting                 |
| ------------------------------------- | -------------------------------- |
| common.network.id                     | None                             |
| common.network.name                   | `--network value`                |
| common.dataDir                        | `--dataDir value`                |

### Nimbus-eth2

| Common Config                         | Nimbus-eth2 Setting        |
| ------------------------------------- | -------------------------- |
| common.network.id                     | None                       |
| common.network.name                   | `--network value`          |
| common.dataDir                        | `--data-dir value`         |

### Prysm

| Common Config                         | Prysm Setting                 |
| ------------------------------------- | ----------------------------- |
| common.network.id                     | `--chain-id value`            |
| common.network.name=mainnet           | `--mainnet`                   |
| common.network.name=sepolia           | `--sepolia`                   |
| common.network.name=ephemery          | `--ephemery`                  |
| common.network.name=holesky           | `--holesky`                   |
| common.network.name=hoodi             | `--hoodi`                     |
| common.dataDir                        | `--datadir value`             |

### Teku

| Common Config                         | Teku Setting                 |
| ------------------------------------- | ---------------------------- |
| common.network.id                     | None                         |
| common.network.name                   | `--network=value`            |
| common.dataDir                        | `--data-path=value`          |


## Notes

- Configuration values are mapped based on the most common usage patterns
- Some clients may have additional configuration options not shown here
- Default values are not shown in the tables but can be found in the common configuration schema
- Network IDs and names are standardized across clients but may have different internal representations

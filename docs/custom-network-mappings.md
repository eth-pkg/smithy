# Custom Network Configuration Mappings

## Common Configuration Names

### Network Configuration

| Common Config Name               | Description                                |
| -------------------------------- | ------------------------------------------ |
| common.network.custom.name       | Custom network name (defaults to "devnet") |
| common.network.custom.testnetDir | Path to testnet directory                  |

### Client-Specific Genesis Files

| Common Config Name                    | Description                 | Required For       |
| ------------------------------------- | --------------------------- | ------------------ |
| common.network.custom.besuGenesisFile | Path to Besu genesis file   | Besu               |
| common.network.custom.genesisFile     | Path to genesis file        | Erigon, Geth, Reth |
| common.network.custom.chainSpecFile   | Path to chain spec file     | Nethermind         |
| common.network.custom.genesisSSZFile  | Path to genesis SSZ file    | Lodestar, Prysm    |
| common.network.custom.paramsFile      | Path to network params file | Teku               |

## Default Paths

All client-specific files default to the following paths under the testnet directory:

- Besu Genesis: `{testnetDir}/besu.json`
- Genesis File: `{testnetDir}/genesis.json`
- Chain Spec: `{testnetDir}/chainspec.json`
- Genesis SSZ: `{testnetDir}/genesis.ssz`
- Params File: `{testnetDir}/config.yaml`

## Client Requirements

### Execution Clients

| Client     | Mapped Settings                                                                            |
| ---------- | ------------------------------------------------------------------------------------------ |
| Besu       | `--genesis-file={common.network.custom.besuGenesisFile}`                                   |
| Erigon     | `erigon init --datadir "{common.execution.dataDir}" "{common.network.custom.genesisFile}"` |
| Geth       | `geth init --datadir "{common.execution.dataDir}" "{common.network.custom.genesisFile}"`   |
| Nethermind | `--Init.ChainSpecPath {common.network.custom.chainSpecFile}`                               |
| Reth       | `--chain {common.network.custom.genesisFile}`                                              |

### Consensus Clients

| Client      | Mapped Settings                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| Lighthouse  | `--testnet-dir {common.network.custom.testnetDir}`                                                    |
| Lodestar    | `--genesis-state-file {common.network.custom.genesisSSZFile}`                                         |
| Nimbus-eth2 | `--network {common.network.custom.testnetDir}`                                                        |
| Prysm       | `--genesis-state {common.network.custom.genesisSSZFile}`                                              |
| Teku        | `--network {common.network.custom.paramsFile} --genesis-state {common.network.custom.genesisSSZFile}` |

### Validator Clients

| Client      | Mapped Settings                                               |
| ----------- | ------------------------------------------------------------- |
| Lighthouse  | `--testnet-dir {common.network.custom.testnetDir}`            |
| Lodestar    | `--genesis-state-file {common.network.custom.genesisSSZFile}` |
| Nimbus-eth2 | `--network {common.network.custom.testnetDir}`                |
| Prysm       | none                                                          |
| Teku        | not sure                                                      |

## Notes

- The testnet directory path defaults to `{common.dataDir}/{common.network.custom.name}`
- All client-specific files are required when using that client with a custom network
- The custom network name defaults to "devnet" if not specified
- File paths can be customized but must point to valid network configuration files
- The testnet directory should contain all necessary network configuration files

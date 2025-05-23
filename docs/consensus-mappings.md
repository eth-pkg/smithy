# Consensus Client Configuration Mappings

## Common Configuration Names

### Client Configuration

| Common Config Name       | Description                          |
| ------------------------ | ------------------------------------ |
| consensus.client.name    | Consensus client implementation name |
| consensus.client.version | Version of the consensus client      |

### HTTP API Configuration

| Common Config Name       | Description                               |
| ------------------------ | ----------------------------------------- |
| consensus.http.enabled   | Enable HTTP JSON-RPC API                  |
| consensus.http.api       | List of JSON-RPC API namespaces to enable |
| consensus.http.address   | HTTP API address                          |
| consensus.http.allowlist | List of allowed CORS origins for HTTP API |
| consensus.http.port      | Port number for HTTP JSON-RPC API         |

### Metrics Configuration

| Common Config Name        | Description                              |
| ------------------------- | ---------------------------------------- |
| consensus.metrics.enabled | Enable metrics collection and reporting  |
| consensus.metrics.host    | IP address to bind the metrics server to |
| consensus.metrics.port    | Port number for metrics server           |

### P2P Configuration

| Common Config Name                | Description                           |
| --------------------------------- | ------------------------------------- |
| consensus.p2p.enabled             | Enable P2P networking                 |
| consensus.p2p.port                | Port number for P2P UDP and TCP       |
| consensus.p2p.port6               | IPv6 P2P port number                  |
| consensus.p2p.quicPort            | Quic P2P port number                  |
| consensus.p2p.quicPort6           | IPv6 Quic P2P port number             |
| consensus.p2p.discoveryPort       | Discovery P2P port number             |
| consensus.p2p.discoveryPort6      | IPv6 Discovery P2P port number        |
| consensus.p2p.bootnodes           | List of bootnode enode URLs           |
| consensus.p2p.staticPeers         | List of static peers to connect to    |
| consensus.p2p.trustedPeers        | List of trusted peers to connect to   |
| consensus.p2p.targetPeers         | Target number of peers to connect to  |
| consensus.p2p.maxPeers            | Maximum number of peers to connect to |
| consensus.p2p.trustedSetupFile    | Path to the trusted setup file        |
| consensus.p2p.nodiscover          | Disable peer discovery                |
| consensus.p2p.listenAddress       | Listen address for P2P networking     |
| consensus.p2p.localPeerDiscovery  | Enable local peer discovery           |
| consensus.p2p.subscribeAllSubnets | Subscribe to all subnets              |
| consensus.p2p.upnp                | Enable UPnP                           |
| consensus.p2p.staticId            | Static ID for the node                |

### Checkpoint Sync Configuration

| Common Config Name                                    | Description                                    |
| ----------------------------------------------------- | ---------------------------------------------- |
| consensus.checkpointSync.enabled                      | Enable checkpoint sync                         |
| consensus.checkpointSync.url                          | URL of trusted beacon node for checkpoint sync |
| consensus.checkpointSync.state                        | State root hash for checkpoint sync            |
| consensus.checkpointSync.ignoreWeakSubjectivityPeriod | Ignore weak subjectivity period                |
| consensus.checkpointSync.force                        | Force checkpoint sync from weak subjectivity   |
| consensus.checkpointSync.wss                          | Weak subjectivity checkpoint format            |

### Genesis Sync Configuration

| Common Config Name            | Description                                 |
| ----------------------------- | ------------------------------------------- |
| consensus.genesisSync.enabled | Enable genesis sync                         |
| consensus.genesisSync.state   | Path to genesis state file                  |
| consensus.genesisSync.url     | URL of trusted beacon node for genesis sync |

### Logging Configuration

| Common Config Name        | Description                            |
| ------------------------- | -------------------------------------- |
| consensus.logging.enabled | Enable logging of the consensus client |
| consensus.logging.file    | Path to store consensus client logs    |
| consensus.logging.format  | Log format (auto/json/plain)           |

### Additional Configuration

| Common Config Name             | Description                                |
| ------------------------------ | ------------------------------------------ |
| consensus.testnetDir           | Path to testnet configuration directory    |
| consensus.validatorMonitorFile | Path to file for validator monitoring data |
| consensus.builder.enabled      | Enable block builder API for MEV           |
| consensus.builder.url          | URL for the block builder API              |
| consensus.dataDir              | Base directory for consensus client data   |

## Client-Specific Mappings

### Lighthouse

| Common Config Name                                    | Lighthouse Setting                    |
| ----------------------------------------------------- | ------------------------------------- |
| consensus.http.enabled                                | `--http`                              |
| consensus.http.api                                    | `--http-api value`                    |
| consensus.http.address                                | `--http-addres value`                 |
| consensus.http.allowlist                              | `--http-allow-origin value`           |
| consensus.http.port                                   | `--http-port value`                   |
| consensus.metrics.enabled                             | `--metrics`                           |
| consensus.metrics.host                                | `--metrics-address value`             |
| consensus.metrics.port                                | `--metrics-port value`                |
| consensus.p2p.enabled                                 | enable p2p overriding                 |
| consensus.p2p.port                                    | `--port value`                        |
| consensus.p2p.port6                                   | `--port6 value`                       |
| consensus.p2p.quicPort                                | `--quic-port value`                   |
| consensus.p2p.quicPort6                               | `--quic-port6 value`                  |
| consensus.p2p.discoveryPort                           | `--discovery-port value`              |
| consensus.p2p.discoveryPort6                          | `--discovery-port6 value`             |
| consensus.p2p.bootnodes                               | `--boot-nodes value`                  |
| consensus.p2p.staticPeers                             | `--libp2p-addresess value`            |
| consensus.p2p.trustedPeers                            | `--trusted-peers value`               |
| consensus.p2p.targetPeers                             | `--target-peers value`                |
| consensus.p2p.maxPeers                                | None                                  |
| consensus.p2p.trustedSetupFile                        | `--trusted-setup-file-override value` |
| consensus.p2p.nodiscover                              | None                                  |
| consensus.p2p.listenAddress                           | `--listen-address value`              |
| consensus.p2p.localPeerDiscovery                      | `--enable-private-discovery`          |
| consensus.p2p.subscribeAllSubnets                     | `--subscribe-all-subnets`             |
| consensus.p2p.upnp=false                              | `--disable-upnp`                      |
| consensus.p2p.staticId                                | None                                  |
| consensus.checkpointSync.enabled                      | enable checkpoint sync                |
| consensus.checkpointSync.url                          | `--checkpoint-sync-url value`         |
| consensus.checkpointSync.state                        | `--checkpoint-sync-state value`       |
| consensus.checkpointSync.ignoreWeakSubjectivityPeriod | None                                  |
| consensus.checkpointSync.force                        | None                                  |
| consensus.checkpointSync.wss                          | `--wss-checkpoint value`              |
| consensus.genesisSync.enabled                         | enable genesis sync                   |
| consensus.genesisSync.state                           | None                                  |
| consensus.genesisSync.url                             | `--genesis-state-url-url`             |
| consensus.logging.enabled                             | enable logging                        |
| consensus.logging.file                                | TODO                                  |
| consensus.logging.format                              | TODO                                  |
| consensus.testnetDir                                  | TODO                                  |
| consensus.validatorMonitorFile                        | TODO                                  |
| consensus.builder.enabled                             | enable builder                        |
| consensus.builder.url                                 | `--builder-url value`                 |
| consensus.dataDir                                     | `--datadir value`                     |

### Lodestar

| Common Config Name                                    | Lodestar Setting                |
| ----------------------------------------------------- | ------------------------------- |
| consensus.http.enabled                                | `--rest value`                  |
| consensus.http.api                                    | `--rest.cors value`             |
| consensus.http.address                                | `--rest.namespace value`        |
| consensus.http.allowlist                              | `--rest.cors value`             |
| consensus.http.port                                   | `--rest.port value`             |
| consensus.metrics.enabled                             | `--metrics`                     |
| consensus.metrics.host                                | `--metrics.address value`       |
| consensus.metrics.port                                | `--metrics.port value`          |
| consensus.p2p.enabled                                 | enable p2p                      |
| consensus.p2p.port                                    | `--port value`                  |
| consensus.p2p.port6                                   | `--port6 value`                 |
| consensus.p2p.quicPort                                | None                            |
| consensus.p2p.quicPort6                               | NOne                            |
| consensus.p2p.discoveryPort                           | `--discoveryPort value`         |
| consensus.p2p.discoveryPort6                          | `--discoveryPort6 value`        |
| consensus.p2p.bootnodes                               | `--bootnodes value`             |
| consensus.p2p.staticPeers                             | None                            |
| consensus.p2p.trustedPeers                            | None                            |
| consensus.p2p.targetPeers                             | `--targetPeers value`           |
| consensus.p2p.maxPeers                                | None                            |
| consensus.p2p.trustedSetupFile                        | None                            |
| consensus.p2p.nodiscover                              | None                            |
| consensus.p2p.listenAddress                           | `--listenAddress value`         |
| consensus.p2p.localPeerDiscovery                      | `--mdns`                        |
| consensus.p2p.subscribeAllSubnets                     | `--subscribeAllSubnets`         |
| consensus.p2p.upnp                                    | `--nat=upnp`                    |
| consensus.p2p.staticId                                | `--persistNetworkIdentity`      |
| consensus.checkpointSync.enabled                      | enable checkpoint sync          |
| consensus.checkpointSync.url                          | `--checkpointSyncUrl`           |
| consensus.checkpointSync.state                        | None                            |
| consensus.checkpointSync.ignoreWeakSubjectivityPeriod | `--ignoreWeakSubjectivityCheck` |
| consensus.checkpointSync.force                        | `--forceCheckpointSync`         |
| consensus.checkpointSync.wss                          | `--wssCheckpoint value`         |
| consensus.genesisSync.enabled                         | enable genesis sync             |
| consensus.genesisSync.state                           | `--genesisStateFile value`      |
| consensus.genesisSync.url                             | `--genesisStateFile value`      |
| consensus.logging.enabled                             | enable logging                  |
| consensus.logging.file                                | TODO                            |
| consensus.logging.format                              | TODO                            |
| consensus.testnetDir                                  | TODO                            |
| consensus.validatorMonitorFile                        | TODO                            |
| consensus.builder.enabled                             | `--builder`                     |
| consensus.builder.url                                 | `--builder.url value`           |
| consensus.dataDir                                     | `--dataDir`                     |

### Nimbus-eth2

| Common Config Name                                    | Nimbus-eth2 Setting                    |
| ----------------------------------------------------- | -------------------------------------- |
| consensus.http.enabled                                | `--rest`                               |
| consensus.http.api                                    | `--rest-api value`                     |
| consensus.http.address                                | `--rest-address value`                 |
| consensus.http.allowlist                              | `--rest-allow-origin value`            |
| consensus.http.port                                   | `--rest-port value`                    |
| consensus.metrics.enabled                             | `--metrics`                            |
| consensus.metrics.host                                | `--metrics-address value`              |
| consensus.metrics.port                                | `--metrics-port value`                 |
| consensus.p2p.enabled                                 | enable p2p                             |
| consensus.p2p.port                                    | `--tcp-port`                           |
| consensus.p2p.port6                                   | None                                   |
| consensus.p2p.quicPort                                | None                                   |
| consensus.p2p.quicPort6                               | None                                   |
| consensus.p2p.discoveryPort                           | `--discovery-port value`               |
| consensus.p2p.discoveryPort6                          | None                                   |
| consensus.p2p.bootnodes                               | `--bootnodes value`                    |
| consensus.p2p.staticPeers                             | `--direct-peers value`                 |
| consensus.p2p.trustedPeers                            | None                                   |
| consensus.p2p.targetPeers                             | None                                   |
| consensus.p2p.maxPeers                                | `--max-peers value`                    |
| consensus.p2p.trustedSetupFile                        | None                                   |
| consensus.p2p.nodiscover                              | NOne                                   |
| consensus.p2p.listenAddress                           | `--listen-address value`               |
| consensus.p2p.localPeerDiscovery                      | None                                   |
| consensus.p2p.subscribeAllSubnets                     | `--subscribe-all-subnets`              |
| consensus.p2p.upnp                                    | `--nat=upnp`                           |
| consensus.p2p.staticId                                | `--agent-string value`                 |
| consensus.checkpointSync.enabled                      | enable checkpoint sync                 |
| consensus.checkpointSync.url                          | `--external-beacon-api-url value`      |
| consensus.checkpointSync.state                        | `--finalized-checkpoint-state value`   |
| consensus.checkpointSync.ignoreWeakSubjectivityPeriod | None                                   |
| consensus.checkpointSync.force                        | None                                   |
| consensus.checkpointSync.wss                          | `--weak-subjectivity-checkpoint value` |
| consensus.genesisSync.enabled                         | enable genesis state sync              |
| consensus.genesisSync.state                           | `--genesis-state value`                |
| consensus.genesisSync.url                             | `--genesis-state-url value`            |
| consensus.logging.enabled                             | enable logging                         |
| consensus.logging.file                                | TODO                                   |
| consensus.logging.format                              | TODO                                   |
| consensus.testnetDir                                  | TODO                                   |
| consensus.validatorMonitorFile                        | TODO                                   |
| consensus.builder.enabled                             | eanble builder                         |
| consensus.builder.url                                 | `--payload-builder-url value`          |
| consensus.dataDir                                     | `--data-dir value`                     |

### Prysm

| Common Config Name                                    | Prysm Setting                          |
| ----------------------------------------------------- | -------------------------------------- |
| consensus.http.enabled                                | enable http                            |
| consensus.http.api                                    | `--http-modules value`                 |
| consensus.http.address                                | `--http-host value`                    |
| consensus.http.allowlist                              | `--http-cors-domain value`             |
| consensus.http.port                                   | `--http-port value`                    |
| consensus.metrics.enabled=false                       | `--disable-monitoring`                 |
| consensus.metrics.host                                | `--monitoring-host value`              |
| consensus.metrics.port                                | None                                   |
| consensus.p2p.enabled                                 | enable p2p                             |
| consensus.p2p.port                                    | `--p2p-tcp-port value`                 |
| consensus.p2p.port6                                   | None                                   |
| consensus.p2p.quicPort                                | `--p2p-quic-port value`                |
| consensus.p2p.quicPort6                               | None                                   |
| consensus.p2p.discoveryPort                           | `--p2p-udp-port value`                 |
| consensus.p2p.discoveryPort6                          | None                                   |
| consensus.p2p.bootnodes                               | `--bootstrap-node value`               |
| consensus.p2p.staticPeers                             | None                                   |
| consensus.p2p.trustedPeers                            | `--peer value`                         |
| consensus.p2p.targetPeers                             | None                                   |
| consensus.p2p.maxPeers                                | `--p2p-max-peers value`                |
| consensus.p2p.trustedSetupFile                        | None                                   |
| consensus.p2p.nodiscover                              | `--no-discovery`                       |
| consensus.p2p.listenAddress                           | `--p2p-local-ip value`                 |
| consensus.p2p.localPeerDiscovery                      | None                                   |
| consensus.p2p.subscribeAllSubnets                     | `--subscribe-all-subnets`              |
| consensus.p2p.upnp                                    | `--enable-upnp`                        |
| consensus.p2p.staticId                                | `--p2p-static-id`                      |
| consensus.checkpointSync.enabled                      | enable checkpoint sync                 |
| consensus.checkpointSync.url                          | `--checkpoint-sync-url value`          |
| consensus.checkpointSync.state                        | `--checkpoint-state value`             |
| consensus.checkpointSync.ignoreWeakSubjectivityPeriod | None                                   |
| consensus.checkpointSync.force                        | None                                   |
| consensus.checkpointSync.wss                          | `--weak-subjectivity-checkpoint value` |
| consensus.genesisSync.enabled                         | enable genesis sync                    |
| consensus.genesisSync.state                           | `--genesis-state value`                |
| consensus.genesisSync.url                             | `--genesis-beacon-api-url value`       |
| consensus.logging.enabled                             | enable logging                         |
| consensus.logging.file                                | TODO                                   |
| consensus.logging.format                              | TODO                                   |
| consensus.testnetDir                                  | TODO                                   |
| consensus.validatorMonitorFile                        | TODO                                   |
| consensus.builder.enabled                             | enable builder                         |
| consensus.builder.url                                 | `--http-mev-relay value`               |
| consensus.dataDir                                     | `--datadir`                            |

### Teku

| Common Config Name                                    | Teku Setting                                   |
| ----------------------------------------------------- | ---------------------------------------------- |
| consensus.http.enabled                                | `--rest-api-enabled`                           |
| consensus.http.api                                    | None                                           |
| consensus.http.address                                | `--rest-api-host-interface value`              |
| consensus.http.allowlist                              | `--rest-api-host-allowlist value`              |
| consensus.http.port                                   | `--rest-api-port value`                        |
| consensus.metrics.enabled                             | `--metrics-enabled`                            |
| consensus.metrics.host                                | `--metrics-interface value`                    |
| consensus.metrics.port                                | `--metrics-port value`                         |
| consensus.p2p.enabled                                 | `--p2p-enabled`                                |
| consensus.p2p.port                                    | `--p2p-port value`                             |
| consensus.p2p.port6                                   | `--p2p-port6 value`                            |
| consensus.p2p.quicPort                                | None                                           |
| consensus.p2p.quicPort6                               | None                                           |
| consensus.p2p.discoveryPort                           | `--p2p-discovery-port value`                   |
| consensus.p2p.discoveryPort6                          | `--p2p-discovery-port6 value`                  |
| consensus.p2p.bootnodes                               | `--p2p-discovery-bootnodes value`              |
| consensus.p2p.staticPeers                             | `--p2p-static-peers value`                     |
| consensus.p2p.trustedPeers                            | None                                           |
| consensus.p2p.targetPeers                             | None                                           |
| consensus.p2p.maxPeers                                | `--p2p-peer-upper-bound value`                 |
| consensus.p2p.trustedSetupFile                        | None                                           |
| consensus.p2p.nodiscover=false                        | `--p2p-discovery-enabled`                      |
| consensus.p2p.listenAddress                           | `--p2p-interface value`                        |
| consensus.p2p.localPeerDiscovery                      | `--p2p-discovery-site-local-addresses-enabled` |
| consensus.p2p.subscribeAllSubnets                     | `--p2p-subscribe-all-subnets-enabled`          |
| consensus.p2p.upnp                                    | `--p2p-nat-method=upnp`                        |
| consensus.p2p.staticId                                | None                                           |
| consensus.checkpointSync.enabled                      | enable checkpoint sync                         |
| consensus.checkpointSync.url                          | `--checkpoint-sync-url value`                  |
| consensus.checkpointSync.state                        | None                                           |
| consensus.checkpointSync.ignoreWeakSubjectivityPeriod | `--ignore-weak-subjectivity-period-enabled`    |
| consensus.checkpointSync.force                        | none                                           |
| consensus.checkpointSync.wss                          | `--wss-checkpoint value`                       |
| consensus.genesisSync.enabled                         | enable genesis sync                            |
| consensus.genesisSync.state                           | `--genesis-state value`                        |
| consensus.genesisSync.url                             | `--genesis-state value`                        |
| consensus.logging.enabled                             | enable logging                                 |
| consensus.logging.file                                | TODO                                           |
| consensus.logging.format                              | TODO                                           |
| consensus.testnetDir                                  | TODO                                           |
| consensus.validatorMonitorFile                        | TODO                                           |
| consensus.builder.enabled                             | enable builder                                 |
| consensus.builder.url                                 | `--builder-endpoint value`                     |
| consensus.dataDir                                     | `--data-path`                                  |

## Notes

- Configuration values are mapped based on the most common usage patterns
- Some clients may have additional configuration options not shown here
- Default values are not shown in the tables but can be found in the consensus.yml schema
- Network-specific settings may vary between clients

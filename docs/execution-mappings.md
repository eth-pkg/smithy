# Execution Client Configuration Mappings

## Execution configuration Names

### Client Configuration

The `execution.client.name` setting determines which execution client will be run. It must be one of:

- `besu`
- `erigon`
- `geth`
- `nethermind`
- `reth`

| Execution config Name    | Description                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------ |
| execution.client.name    | The execution client implementation to use                                           |
| execution.client.version | Version of the execution client to use. Must be a valid semver string                |
| execution.isExternal     | Whether the consensus client is external to the node, running in a different process |

### P2P Configuration

| Execution config Name              | Description                                                           |
| ---------------------------------- | --------------------------------------------------------------------- |
| execution.p2p.address              | Network interface to listen on                                        |
| execution.p2p.port                 | Port number for P2P networking                                        |
| execution.p2p.dnsDiscovery.enabled | Enable DNS discovery                                                  |
| execution.p2p.dnsDiscovery.url     | URL for DNS discovery                                                 |
| execution.p2p.discovery.enabled    | Enable discovery                                                      |
| execution.p2p.discovery.port       | Port number for discovery                                             |
| execution.p2p.discovery.v4.enabled | Enable discovery v4                                                   |
| execution.p2p.discovery.v5.enabled | Enable discovery v5                                                   |
| execution.p2p.nat.mode             | NAT configuration                                                     |
| execution.p2p.nat.enabled          | Enable NAT configuration                                              |
| execution.p2p.identity             | Identity of the node                                                  |
| execution.p2p.maxPeers             | Maximum number of P2P peers to connect to                             |
| execution.p2p.bootnodes            | List of bootnode enode URLs                                           |
| execution.p2p.allowlist            | List of allowed CORS origins                                          |
| execution.p2p.netrestrict          | Restricts network communication to the given IP networks (CIDR masks) |

### HTTP API Configuration

| Execution config Name    | Description                       |
| ------------------------ | --------------------------------- |
| execution.http.enabled   | Enable HTTP JSON-RPC API          |
| execution.http.modules   | List of JSON-RPC API namespaces   |
| execution.http.address   | HTTP API host                     |
| execution.http.allowlist | List of allowed CORS origins      |
| execution.http.port      | Port number for HTTP JSON-RPC API |

### WebSocket API Configuration

| Execution config Name  | Description                     |
| ---------------------- | ------------------------------- |
| execution.ws.enabled   | Enable WebSocket JSON-RPC API   |
| execution.ws.port      | Port number for WebSocket API   |
| execution.ws.address   | WebSocket API host              |
| execution.ws.modules   | List of JSON-RPC API namespaces |
| execution.ws.allowlist | List of allowed CORS origins    |

### Metrics Configuration

| Execution config Name     | Description                    |
| ------------------------- | ------------------------------ |
| execution.metrics.enabled | Enable metrics collection      |
| execution.metrics.port    | Port number for metrics server |
| execution.metrics.address | Address for metrics server     |

### Logging Configuration

| Execution config Name            | Description              |
| -------------------------------- | ------------------------ |
| execution.logging.stdout.enabled | Enable stdout logging    |
| execution.logging.stdout.level   | Logging level            |
| execution.logging.stdout.format  | Logging format           |
| execution.logging.stdout.color   | Enable colorized logging |
| execution.logging.file.enabled   | Enable file logging      |
| execution.logging.file.directory | Log directory            |
| execution.logging.file.level     | Logging level            |
| execution.logging.file.format    | Logging format           |
| execution.logging.file.name      | Log file name            |
| execution.logging.file.fullPath  | Full path to log file    |

### GraphQL Configuration

| Execution config Name       | Description                  |
| --------------------------- | ---------------------------- |
| execution.graphql.enabled   | Enable GraphQL HTTP service  |
| execution.graphql.address   | GraphQL host                 |
| execution.graphql.port      | GraphQL port                 |
| execution.graphql.allowlist | List of allowed CORS origins |

### Transaction Pool Configuration

TODO

### Data Directory

| Execution config Name | Description                              |
| --------------------- | ---------------------------------------- |
| execution.dataDir     | Base directory for execution client data |

### Gas Price Oracle Configuration

| Execution config Name     | Description                    |
| ------------------------- | ------------------------------ |
| execution.gpo.enabled     | Enable gas price oracle        |
| execution.gpo.blocks      | Number of blocks for gas price |
| execution.gpo.maxPrice    | Maximum gas price              |
| execution.gpo.ignorePrice | Ignore price threshold         |
| execution.gpo.percentile  | Gas price percentile           |

## Execution Clients

### Besu

| Execution config                     | Besu Setting                        |
| ------------------------------------ | ----------------------------------- |
| execution.p2p.address                | `--p2p-host=value`                  |
| execution.p2p.port                   | `--p2p-port=value`                  |
| execution.p2p.dnsDiscovery.enabled   | enables dns discovery               |
| execution.p2p.dnsDiscovery.url       | `--discovery-dns-url=value`         |
| execution.p2p.discovery.enabled      | `--discovery-enabled`               |
| execution.p2p.discovery.port         | ??                                  |
| execution.p2p.discovery.v4.enabled   | ??                                  |
| execution.p2p.discovery.v5.enabled   | ??                                  |
| execution.p2p.nat.mode               | `nat-method=value`                  |
| execution.p2p.nat.enabled            | enable nat                          |
| execution.p2p.identity               | `--identity=value`                  |
| execution.p2p.maxPeers               | `--max-peers=value`                 |
| execution.p2p.bootnodes              | `--bootnodes=value`                 |
| execution.p2p.allowlist              | `--host-allowlist=value`            |
| execution.p2p.netrestrict            | ??                                  |
| execution.http.enabled               | `--rpc-http-enabled`                |
| execution.http.modules               | `--rpc-http-api=value`              |
| execution.http.address               | `--rpc-http-host=value`             |
| execution.http.allowlist             | ??                                  |
| execution.http.port                  | `--rpc-http-port=value`             |
| execution.ws.enabled                 | `--rpc-ws-enabled`                  |
| execution.ws.port                    | `--rpc-ws-port=value`               |
| execution.ws.address                 | `--rpc-ws-host=value`               |
| execution.ws.modules                 | `--rpc-ws-apis=value`               |
| execution.ws.allowlist               | None                                |
| execution.metrics.enabled            | `--metrics-enabled`                 |
| execution.metrics.port               | `--metrics-port=value`              |
| execution.metrics.address            | `--metrics-host=value`              |
| execution.logging.stdout.enabled     | enables console logging             |
| execution.logging.stdout.level       | `--logging=value`                   |
| execution.logging.stdout.format=json | `--json-pretty-print-enabled`       |
| execution.logging.stdout.color       | `--color-enabled`                   |
| execution.logging.file.enabled       | enables file logging                |
| execution.logging.file.directory     | TODO                                |
| execution.logging.file.level         | TODO                                |
| execution.logging.file.format        | TODO                                |
| execution.logging.file.name          | TODO                                |
| execution.logging.file.fullPath      | TODO                                |
| execution.graphql.enabled            | `--graphql-http-enabled`            |
| execution.graphql.address            | `--graphql-http-host=value`         |
| execution.graphql.port               | `--graphql-http-port=value`         |
| execution.graphql.allowlist          | `--graphql-http-cors-origins=value` |
| execution.dataDir                    | `--data-path=value`                 |
| execution.gpo.enabled                | enable overriding eth_gasPrice      |
| execution.gpo.blocks                 | `--api-gas-price-blocks=value`      |
| execution.gpo.maxPrice               | `--api-gas-price-max=value`         |
| execution.gpo.ignorePrice            | None                                |
| execution.gpo.percentile             | `--api-gas-price-percentile`        |

### Erigon

| Execution config                         | Erigon Setting               |
| ---------------------------------------- | ---------------------------- |
| execution.p2p.address                    | `--p2p.addr value`           |
| execution.p2p.port                       | `--p2p.port value`           |
| execution.p2p.dnsDiscovery.enabled=false | `--discovery.dns=""`         |
| execution.p2p.dnsDiscovery.url           | `--discovery.dns value`      |
| execution.p2p.discovery.enabled=false    | `--nodiscover`               |
| execution.p2p.discovery.port             | ??                           |
| execution.p2p.discovery.v4.enabled       | ??                           |
| execution.p2p.discovery.v5.enabled       | ??                           |
| execution.p2p.nat.mode                   | `--nat value`                |
| execution.p2p.nat.enabled                | None                         |
| execution.p2p.identity                   | `--identity value`           |
| execution.p2p.maxPeers                   | `--maxpeers value`           |
| execution.p2p.bootnodes                  | `--bootnodes value`          |
| execution.p2p.allowlist                  | ??                           |
| execution.p2p.netrestrict                | `--netrestrict value`        |
| execution.http.enabled                   | `--http`                     |
| execution.http.modules                   | `--http.api value`           |
| execution.http.address                   | `--http.addr value`          |
| execution.http.allowlist                 | `--http.corsdomain value`    |
| execution.http.port                      | `--http.port value`          |
| execution.ws.enabled                     | `--ws`                       |
| execution.ws.port                        | `--ws.port value`            |
| execution.ws.address                     | `--ws.addr value`            |
| execution.ws.modules                     | `--ws.api value`             |
| execution.ws.allowlist                   | `--ws.corsdomain value`      |
| execution.metrics.enabled                | `--metrics`                  |
| execution.metrics.port                   | `--metrics.port value`       |
| execution.metrics.address                | `--metrics.addr value`       |
| execution.logging.stdout.enabled         | `--log.console.json`         |
| execution.logging.stdout.level           | `--verbosity value`          |
| execution.logging.stdout.format=json     | `--log.console.json`         |
| execution.logging.stdout.color           | None                         |
| execution.logging.file.enabled           | enables file logging         |
| execution.logging.file.directory         | `--log.dir.path value`       |
| execution.logging.file.level             | `--log.dir.verbosity value`  |
| execution.logging.file.format=json       | `--log.dir.json`             |
| execution.logging.file.name              | `--log.dir.prefix value`     |
| execution.logging.file.fullPath          | None                         |
| execution.graphql.enabled                | `--graphql`                  |
| execution.graphql.address                | `--graphql.addr value`       |
| execution.graphql.port                   | `--graphql.port value`       |
| execution.graphql.allowlist              | `--graphql.corsdomain value` |
| execution.dataDir                        | `--datadir value`            |
| execution.gpo.enabled                    | enable eth_gasPrice override |
| execution.gpo.blocks                     | `--gpo.blocks value`         |
| execution.gpo.maxPrice                   | None                         |
| execution.gpo.ignorePrice                | None                         |
| execution.gpo.percentile                 | `--gpo.percentile value`     |
| execution.isExternal                     | `--externalcl`               |

### Geth

| Execution config                         | Geth Setting                    |
| ---------------------------------------- | ------------------------------- |
| execution.p2p.address                    | `--addr value`                  |
| execution.p2p.port                       | `--port value`                  |
| execution.p2p.dnsDiscovery.enabled=false | `--discovery.dns=""`            |
| execution.p2p.dnsDiscovery.url           | `--discovery.dns value`         |
| execution.p2p.discovery.enabled=false    | `--nodiscover`                  |
| execution.p2p.discovery.port             | `--discovery.port value`        |
| execution.p2p.discovery.v4.enabled       | `--discovery.v4`                |
| execution.p2p.discovery.v5.enabled       | `--discovery.v5`                |
| execution.p2p.nat.mode                   | None                            |
| execution.p2p.nat.enabled                | `--nat value`                   |
| execution.p2p.identity                   | `--identity value`              |
| execution.p2p.maxPeers                   | `--maxpeers value`              |
| execution.p2p.bootnodes                  | `--bootnodes value`             |
| execution.p2p.allowlist                  | None                            |
| execution.p2p.netrestrict                | `--netrestrict value`           |
| execution.http.enabled                   | `--http`                        |
| execution.http.modules                   | `--http.api value`              |
| execution.http.address                   | `--http.addr value`             |
| execution.http.allowlist                 | `--http.corsdomain value`       |
| execution.http.port                      | `--http.port value`             |
| execution.ws.enabled                     | `--ws`                          |
| execution.ws.port                        | `--ws.port value`               |
| execution.ws.address                     | `--ws.addr value`               |
| execution.ws.modules                     | `--ws.api value`                |
| execution.ws.allowlist                   | `--ws.origins value`            |
| execution.metrics.enabled                | `--metrics`                     |
| execution.metrics.port                   | `--metrics.port value`          |
| execution.metrics.address                | `--metrics.addr value`          |
| execution.logging.stdout.enabled         | enables file logging            |
| execution.logging.stdout.level           | `--verbosity value`             |
| execution.logging.stdout.format          | `--log.format value`            |
| execution.logging.stdout.color           | None                            |
| execution.logging.file.enabled           | `--log.file value`              |
| execution.logging.file.directory         | None                            |
| execution.logging.file.level             | Same as ??`--log.format`        |
| execution.logging.file.format            | `--log.format value`            |
| execution.logging.file.name              | None                            |
| execution.logging.file.fullPath          | `--log.file value`              |
| execution.graphql.enabled                | `--graphql`                     |
| execution.graphql.address                | None                            |
| execution.graphql.port                   | None                            |
| execution.graphql.allowlist              | `--graphql.corsdomain value`    |
| execution.dataDir                        | `--datadir value`               |
| execution.gpo.enabled                    | enabled overriding eth_gasPrice |
| execution.gpo.blocks                     | `--gpo.blocks value`            |
| execution.gpo.maxPrice                   | `--gpo.maxprice value`          |
| execution.gpo.ignorePrice                | `--gpo.ignoreprice value`       |
| execution.gpo.percentile                 | `--gpo.percentile value`        |

### Nethermind

| Execution config                   | Nethermind Setting               |
| ---------------------------------- | -------------------------------- |
| execution.p2p.address              | ?? `--Network.LocalIp value`     |
| execution.p2p.port                 | `--Network.P2PPort value`        |
| execution.p2p.dnsDiscovery.enabled | enable discovery dns             |
| execution.p2p.dnsDiscovery.url     | `--Network.DiscoveryDns value`   |
| execution.p2p.discovery.enabled    | `--Init.DiscoveryEnabled`        |
| execution.p2p.discovery.port       | `--Network.DiscoveryPort value`  |
| execution.p2p.discovery.v4.enabled | None                             |
| execution.p2p.discovery.v5.enabled | None                             |
| execution.p2p.nat.enable           | enable nat                       |
| execution.p2p.nat.mode=upnp        | `--Network.EnableUPnP`           |
| execution.p2p.nat.mode=externalip  | `--Network.ExternalIp`           |
| execution.p2p.identity             | ??                               |
| execution.p2p.maxPeers             | `--Network.MaxActivePeers value` |
| execution.p2p.bootnodes            | `--Network.Bootnodes value`      |
| execution.p2p.allowlist            | `--JsonRpc.CorsOrigins value`    |
| execution.p2p.netrestrict          | None                             |
| execution.http.enabled             | `--JsonRpc.Enabled`              |
| execution.http.modules             | `--JsonRpc.EnabledModules value` |
| execution.http.address             | `--JsonRpc.Host value`           |
| execution.http.allowlist           | `--JsonRpc.CorsOrigins value`    |
| execution.http.port                | `--JsonRpc.Port value`           |
| execution.ws.enabled               | `--Init.WebSocketsEnabled`       |
| execution.ws.port                  | `--JsonRpc.WebSocketsPort value` |
| execution.ws.address               | `--JsonRpc.Host value`           |
| execution.ws.modules               | `--JsonRpc.EnabledModules value` |
| execution.ws.allowlist             | `--JsonRpc.CorsOrigins value`    |
| execution.metrics.enabled          | `--Metrics.Enabled`              |
| execution.metrics.port             | `--Metrics.ExposePort value`     |
| execution.metrics.address          | `--Metrics.ExposeHost value`     |
| execution.logging.stdout.enabled   |                                  |
| execution.logging.stdout.level     |                                  |
| execution.logging.stdout.format    |                                  |
| execution.logging.stdout.color     |                                  |
| execution.logging.file.enabled     | `--Init.LogDirectory value`      |
| execution.logging.file.directory   | `--Init.LogDirectory value`      |
| execution.logging.file.level       |                                  |
| execution.logging.file.format      |                                  |
| execution.logging.file.name        | `--Init.LogFileName value`       |
| execution.logging.file.fullPath    |                                  |
| execution.graphql.enabled          |                                  |
| execution.graphql.address          |                                  |
| execution.graphql.port             |                                  |
| execution.graphql.allowlist        |                                  |
| execution.dataDir                  | `--datadir value`                |
| execution.gpo.enabled              |                                  |
| execution.gpo.blocks               | None                             |
| execution.gpo.maxPrice             | None                             |
| execution.gpo.ignorePrice          | None                             |
| execution.gpo.percentile           | None                             |

### Reth

| Execution config                         | Reth Setting                 |
| ---------------------------------------- | ---------------------------- |
| execution.p2p.address                    | `--addr value`               |
| execution.p2p.port                       | `--port value`               |
| execution.p2p.dnsDiscovery.enabled=false | `--disable-dns-discovery`    |
| execution.p2p.dnsDiscovery.url           |                              |
| execution.p2p.discovery.enabled=false    | `--disable-discovery`        |
| execution.p2p.discovery.port             |                              |
| execution.p2p.discovery.v4.enabled       | `--disable-discv4-discovery` |
| execution.p2p.discovery.v5.enabled       | `--enable-discv5-discovery`  |
| execution.p2p.nat.mode                   | `--nat value`                |
| execution.p2p.nat.enabled                | `--disable-nat`              |
| execution.p2p.identity                   | `--identity value`           |
| execution.p2p.maxPeers                   |                              |
| execution.p2p.bootnodes                  | `--bootnodes value`          |
| execution.p2p.allowlist                  |                              |
| execution.p2p.netrestrict                |                              |
| execution.http.enabled                   | `--http`                     |
| execution.http.modules                   | `--http.api value`           |
| execution.http.address                   | `--http.addr value`          |
| execution.http.allowlist                 | `--http.corsdomain value`    |
| execution.http.port                      | `--http.port value`          |
| execution.ws.enabled                     | `--ws`                       |
| execution.ws.port                        | `--ws.port value`            |
| execution.ws.address                     | `--ws.addr value`            |
| execution.ws.modules                     | `--ws.api value`             |
| execution.ws.allowlist                   | `--ws.origins value`         |
| execution.metrics.enabled                | `--metrics`                  |
| execution.metrics.port                   |                              |
| execution.metrics.address                |                              |
| execution.logging.stdout.enabled         |                              |
| execution.logging.stdout.level           | `--verbosity value`          |
| execution.logging.stdout.format          | `--log.stdout.format value`  |
| execution.logging.stdout.color           | `--color value`              |
| execution.logging.file.enabled           |                              |
| execution.logging.file.directory         | `--log.file.directory value` |
| execution.logging.file.level             | `--log.file.filter value`    |
| execution.logging.file.format            | `--log.file.format value`    |
| execution.logging.file.name              |                              |
| execution.logging.file.fullPath          |                              |
| execution.graphql.enabled                |                              |
| execution.graphql.address                |                              |
| execution.graphql.port                   |                              |
| execution.graphql.allowlist              |                              |
| execution.dataDir                        | `--datadir value`            |
| execution.gpo.enabled                    | enable eth_gasPrice override |
| execution.gpo.blocks                     | `--gpo.blocks value`         |
| execution.gpo.maxPrice                   | `--gpo.maxprice value`       |
| execution.gpo.ignorePrice                | `--gpo.ignoreprice value`    |
| execution.gpo.percentile                 | `--gpo.percentile value`     |

## Notes

- Configuration values are mapped based on the most common usage patterns
- Some clients may have additional configuration options not shown here
- Default values are not shown in the tables but can be found in the execution configuration schema

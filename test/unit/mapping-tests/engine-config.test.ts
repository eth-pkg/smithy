import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName, ConsensusClientName } from '@/lib/types';
import { testConfig } from '../preset-tests/network-preset.test-helper';

describe('Engine Configuration Tests', () => {
  let registry: CommandClientRegistry;

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  describe('Execution Client Engine API Configuration', () => {
    const executionClients: ExecutionClientName[] = [
      'besu',
      'erigon',
      'geth',
      'nethermind',
      'reth'
    ];

    // TODO: need to test allowlist when it is a list of hosts
    executionClients.forEach(client => {
      it(`should correctly configure engine API for ${client}`, () => {
        const config = {
          ...testConfig,
          common: {
            ...testConfig.common,
            engine: {
              api: {
                scheme: 'http' as const,
                host: 'localhost',
                allowlist: ['localhost'],
                port: 8551,
                urls: ['{common.engine.api.scheme}://{common.engine.api.host}:{common.engine.api.port}'],
                ip: '127.0.0.1',
              },
              jwt: {
                file: '{common.dataDir}/{common.network.name}/engine.jwt',
                id: ''
              },
            }
          },
          execution: {
            ...testConfig.execution,
            client: {
              name: client,
              version: ''
            },
          }
        };

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const jwtFile = `${config.common.dataDir}/${config.common.network.name}/engine.jwt`
        const allowlistString = config.common.engine.api.allowlist.join(',');
        switch (client) {
          case 'besu':
            // TODO not sure about this
            // expect(scriptString).to.contain(`--engine-rpc-enabled`);
            expect(scriptString).to.contain(`--engine-rpc-port=${config.common.engine.api.port}`);
            expect(scriptString).to.contain(`--engine-host-allowlist="${allowlistString}"`);
            expect(scriptString).to.contain(`--engine-jwt-secret=${jwtFile}`);
            expect(scriptString).to.not.contain('http://localhost:8551');
            break;
          case 'erigon':
            expect(scriptString).to.contain(`--authrpc.port ${config.common.engine.api.port}`);
            expect(scriptString).to.contain(`--authrpc.addr ${config.common.engine.api.host}`);
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${jwtFile}`);
            expect(scriptString).to.contain(`--authrpc.vhosts "${allowlistString}"`);
            expect(scriptString).to.contain('--externalcl');
            break;
          case 'geth':
            expect(scriptString).to.contain(`--authrpc.port ${config.common.engine.api.port}`);
            expect(scriptString).to.contain(`--authrpc.addr ${config.common.engine.api.host}`);
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${jwtFile}`);
            expect(scriptString).to.contain(`--authrpc.vhosts "${allowlistString}"`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--JsonRpc.EnginePort ${config.common.engine.api.port}`);
            expect(scriptString).to.contain(`--JsonRpc.EngineHost ${config.common.engine.api.host}`);
            expect(scriptString).to.contain(`--JsonRpc.JwtSecretFile ${jwtFile}`);
            expect(scriptString).to.contain(`--JsonRpc.EngineEnabledModules "${allowlistString}"`);
            break;
          case 'reth':
            expect(scriptString).to.contain(`--authrpc.port ${config.common.engine.api.port}`);
            expect(scriptString).to.contain(`--authrpc.addr ${config.common.engine.api.host}`);
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${jwtFile}`);
            // expect(scriptString).to.contain(`--authrpc.vhosts ${config.common.engine.allowlist}`);
            break;
        }
      });

      const allowlist = [
        ["*"],
        ["localhost"],
        ["127.0.0.1"],
        ["0.0.0.0"],
        ["::1"],
        ["::"],
        ["0.0.0.0"],
        ["all"],
        ["*", "localhost", "127.0.0.1", "0.0.0.0", "::1", "::", "0.0.0.0"],
        ["all", "localhost", "127.0.0.1", "0.0.0.0", "::1", "::", "0.0.0.0"],
        ["localhost", "127.0.0.1", "0.0.0.0", "::1", "::", "0.0.0.0"]
      ];
      allowlist.forEach(host => {
        it(`should correctly configure allowlist=${host} for ${client}`, () => {
          const config = {
            ...testConfig,
            common: {
              ...testConfig.common,
              engine: {
                api: {
                  scheme: 'http' as const,
                  host: 'localhost',
                  allowlist: host,
                  port: 8551,
                  urls: ['{common.engine.api.scheme}://{common.engine.api.host}:{common.engine.api.port}'],
                  ip: '127.0.0.1',
                },
                jwt: {
                  file: '{common.dataDir}/jwt.hex',
                  id: ''
                },
              }
            },
            execution: {
              ...testConfig.execution,
              client: {
                name: client,
                version: ''
              },
            }
          };
          const scriptContent = registry.getScriptContent(client, config);
          const scriptString = scriptContent.toString();
          const allowlistString = host.join(',');
          switch (client) {
            case 'besu':
              // Note: Besu does not support mixing '*' or 'all' with other values in engine-host-allowlist
              // This is validated separately in the configuration validation logic
              // So we don't need to test for it here
              expect(scriptString).to.contain(`--engine-host-allowlist="${allowlistString}"`)
              break;
            case 'erigon':
              expect(scriptString).to.contain(`--authrpc.vhosts "${allowlistString}"`);
              break;
            case 'geth':
              expect(scriptString).to.contain(`--authrpc.vhosts "${allowlistString}"`);
              break;
            case 'nethermind':
              expect(scriptString).to.contain(`--JsonRpc.EngineEnabledModules "${allowlistString}"`);
              break;
            case 'reth':
              expect(scriptString).to.contain(`--authrpc.vhosts "${allowlistString}"`);
              break;
          }
        });
      })

      it(`should handle JWT communication mode for ${client}`, () => {
        const config = {
          ...testConfig,
          common: {
            ...testConfig.common,
            engine: {
              enabled: true,
              api: {
                urls: ['http://localhost:8551'],
                host: 'localhost',
                allowlist: ['localhost'],
                ip: '127.0.0.1',
                scheme: 'http' as const,
                port: 8551
              },
              jwt: {
                file: '/path/to/jwt.hex',
                id: ''
              },
              ipc: { path: '' }
            }
          },
          execution: {
            ...testConfig.execution,
            client: {
              name: client,
              version: ''
            },
          }
        };

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain(`--engine-jwt-secret=${config.common.engine.jwt.file}`);
            break;
          case 'erigon':
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${config.common.engine.jwt.file}`);
            break;
          case 'geth':
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${config.common.engine.jwt.file}`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--JsonRpc.JwtSecretFile ${config.common.engine.jwt.file}`);
            expect(scriptString).to.not.contain('--JsonRpc.IpcUnixDomainSocketPath');
            break;
          case 'reth':
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${config.common.engine.jwt.file}`);
            break;
        }
      });

    });
  });



  describe('Consensus Client Engine API Configuration', () => {
    const consensusClients: ConsensusClientName[] = [
      'lighthouse',
      'lodestar',
      'nimbus-eth2',
      'prysm',
      'teku'
    ];

    consensusClients.forEach(client => {
      it(`should correctly configure engine API for ${client}`, () => {
        const config = {
          ...testConfig,
          common: {
            ...testConfig.common,
            engine: {
              enabled: true,
              port: 8551,
              api: {
                urls: ['{common.engine.api.scheme}://{common.engine.api.host}:{common.engine.api.port}',
                  'http://additionalurl:8551'
                ],
                host: 'localhost',
                allowlist: ['localhost'],
                ip: '127.0.0.1',
                scheme: 'http' as const,
                port: 8551
              },
              jwt: {
                file: '{common.dataDir}/{common.network.name}/engine.jwt',
                id: ''
              },
            }
          },
          consensus: {
            ...testConfig.consensus,
            client: {
              name: client,
              version: ''
            },
          }
        };

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const url = `${config.common.engine.api.scheme}://${config.common.engine.api.host}:${config.common.engine.api.port}`
        const jwtFile = `${config.common.dataDir}/${config.common.network.name}/engine.jwt`
        const additionalUrl = 'http://additionalurl:8551'
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain(`--execution-endpoint ${url}`);
            expect(scriptString).to.contain(`--execution-endpoint ${additionalUrl}`);
            expect(scriptString).to.contain(`--execution-jwt ${jwtFile}`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--execution.urls ${url},${additionalUrl}`);
            expect(scriptString).to.contain(`--jwtSecret ${jwtFile}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain(`--web3-url ${url},${additionalUrl}`);
            expect(scriptString).to.contain(`--jwt-secret ${jwtFile}`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--execution-endpoint ${url}`);
            expect(scriptString).to.contain(`--execution-endpoint ${additionalUrl}`);
            expect(scriptString).to.contain(`--jwt-secret ${jwtFile}`);
            break;
          case 'teku':
            expect(scriptString).to.contain(`--ee-endpoint=${url}`);
            expect(scriptString).to.contain(`--ee-endpoint=${additionalUrl}`);
            expect(scriptString).to.contain(`--ee-jwt-secret-file=${jwtFile}`);
            break;
        }
      });
    });
  });
}); 
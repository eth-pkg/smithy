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
              enabled: true,  
              api: {
                scheme: 'http' as const,
                host: 'localhost',
                allowlist: ['localhost'],
                port: 8551,
                url: '{common.engine.api.scheme}://{common.engine.api.host}:{common.engine.api.port}',
                ip: '127.0.0.1',
              },
              communication: {
                method: 'jwt' as const,
                jwt: {
                  file: '{common.dataDir}/{common.network.name}/engine.jwt',
                  id: ''
                },
                ipc: { path: '' }
              }
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
            expect(scriptString).to.contain(`--engine-rpc-enabled`);
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
                enabled: true,
                api: {  
                  scheme: 'http' as const,
                  host: 'localhost',
                  allowlist: host,
                  port: 8551,
                  url: '{common.engine.api.scheme}://{common.engine.api.host}:{common.engine.api.port}',
                  ip: '127.0.0.1',
                },
                communication: {
                  method: 'jwt' as const,
                  jwt: {
                    file: '{common.dataDir}/jwt.hex',
                    id: ''
                  },
                  ipc: { path: '' }
                }
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
              // expect(scriptString).to.contain(`--authrpc.vhosts "*"`);
              break;
          }
        });
      })

      it(`should handle IPC communication mode for ${client}`, () => {
        const config = {
          ...testConfig,
          common: {
            ...testConfig.common,
            engine: {
              ...testConfig.common.engine,
              enabled: true,
              communication: {
                method: 'ipc' as const,
                ipc: { path: 'ipc:///path/to/ipc.sock' },
                jwt: { file: '', id: '' }
              }
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
            expect(scriptString).to.contain('--Xrpc-ipc-enabled');
            expect(scriptString).to.not.contain('--engine-jwt-secret');

            break;
          case 'erigon':
            // erigon does not support IPC communication
            // expect(scriptString).to.contain('--authrpc.ipcpath=/path/to/ipc.sock');
            expect(scriptString).to.not.contain('--authrpc.jwtsecret');
            break;
          case 'geth':
            expect(scriptString).to.contain(`--ipcpath ${config.common.engine.communication.ipc.path}`);
            expect(scriptString).to.not.contain('--authrpc.jwtsecret');
            expect(scriptString).to.not.contain('--ipcdisable');
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--JsonRpc.IpcUnixDomainSocketPath ${config.common.engine.communication.ipc.path}`);
            expect(scriptString).to.not.contain('--JsonRpc.JwtSecretFile');
            expect(scriptString).to.not.contain('--JsonRpc.EngineEnabledModules');
            expect(scriptString).to.not.contain('--JsonRpc.EnginePort');
            expect(scriptString).to.not.contain('--JsonRpc.EngineHost');
            break;
          case 'reth':
            expect(scriptString).to.contain(`--auth-ipc`);
            expect(scriptString).to.contain(`--auth-ipc.path ${config.common.engine.communication.ipc.path}`);
            expect(scriptString).to.not.contain('--authrpc.jwtsecret');
            expect(scriptString).to.not.contain('--authrpc.addr');
            expect(scriptString).to.not.contain('--authrpc.port');
            break;
        }
      });

      it(`should handle JWT communication mode for ${client}`, () => {
        const config = {
          ...testConfig,
          common: {
            ...testConfig.common,
            engine: {
              enabled: true,
              api: {
                url: 'http://localhost:8551',
                host: 'localhost',
                allowlist: ['localhost'],
                ip: '127.0.0.1',
                scheme: 'http' as const,
                port: 8551
              },
              communication: {
                method: 'jwt' as const,
                jwt: {
                  file: '/path/to/jwt.hex',
                  id: ''
                },
                ipc: { path: '' }
              }
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
            expect(scriptString).to.contain(`--engine-jwt-secret=${config.common.engine.communication.jwt.file}`);
            expect(scriptString).to.not.contain('--Xrpc-ipc-enabled');
            break;
          case 'erigon':
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${config.common.engine.communication.jwt.file}`);
            break;
          case 'geth':
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${config.common.engine.communication.jwt.file}`);
            expect(scriptString).to.contain('--ipcdisable');
            expect(scriptString).to.not.contain('--ipcpath');
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--JsonRpc.JwtSecretFile ${config.common.engine.communication.jwt.file}`);
            expect(scriptString).to.not.contain('--JsonRpc.IpcUnixDomainSocketPath');
            break;
          case 'reth':
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${config.common.engine.communication.jwt.file}`);
            expect(scriptString).to.not.contain('--auth-ipc');
            expect(scriptString).to.not.contain('--auth-ipc.path');
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
                url: '{common.engine.api.scheme}://{common.engine.api.host}:{common.engine.api.port}',
                host: 'localhost',
                allowlist: ['localhost'],
                ip: '127.0.0.1',
                scheme: 'http' as const,
                port: 8551
              },
              communication: {
                method: 'jwt' as const,
                jwt: {
                  file: '{common.dataDir}/{common.network.name}/engine.jwt',
                  id: ''
                },
                ipc: { path: '' }
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

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain(`--execution-endpoint ${url}`);
            expect(scriptString).to.contain(`--execution-jwt ${jwtFile}`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain(`--execution.urls ${url}`);
            expect(scriptString).to.contain(`--jwtSecret ${jwtFile}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain(`--web3-url ${url}`);
            expect(scriptString).to.contain(`--jwt-secret ${jwtFile}`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--execution-endpoint ${url}`);
            expect(scriptString).to.contain(`--jwt-secret ${jwtFile}`);
            break;
          case 'teku':
            expect(scriptString).to.contain(`--ee-endpoint=${url}`);
            expect(scriptString).to.contain(`--ee-jwt-secret-file=${jwtFile}`);
            break;
        }
      });

      it.skip(`should handle IPC communication mode for ${client}`, () => {
        const config = {
          ...testConfig,
          common: {
            ...testConfig.common,
            engine: {
              ...testConfig.common.engine,
              enabled: true,
              communication: {
                ...testConfig.common.engine.communication,
                method: 'ipc' as const,
                ipc: {
                  path: 'ipc:///path/to/ipc.sock'
                }
              }
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

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain('--execution-endpoint=ipc:///path/to/ipc.sock');
            expect(scriptString).to.not.contain('--execution-jwt');
            break;
          case 'lodestar':
            expect(scriptString).to.contain('--execution.urls=ipc:///path/to/ipc.sock');
            expect(scriptString).to.not.contain('--execution.jwtSecret');
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain('--web3-url=ipc:///path/to/ipc.sock');
            expect(scriptString).to.not.contain('--jwt-secret');
            break;
          case 'prysm':
            expect(scriptString).to.contain('--execution-endpoint=ipc:///path/to/ipc.sock');
            expect(scriptString).to.not.contain('--jwt-secret');
            break;
          case 'teku':
            expect(scriptString).to.contain('--ee-endpoint=ipc:///path/to/ipc.sock');
            expect(scriptString).to.not.contain('--ee-jwt-secret-file');
            break;
        }
      });

      it.skip(`should handle JWT communication mode for ${client}`, () => {
        const config = {
          ...testConfig,
          common: {
            ...testConfig.common,
            engine: {
              enabled: true,
              api: {
                url: 'http://localhost:8551',
                host: 'localhost',
                allowlist: ['localhost'],
                ip: '127.0.0.1',
                scheme: 'http' as const,
                port: 8551
              },
              communication: {
                method: 'jwt' as const,
                jwt: {
                  file: '/path/to/jwt.hex',
                  id: ''
                },
                ipc: {
                  path: ''
                }
              }
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

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain('--execution-jwt=/path/to/jwt.hex');
            expect(scriptString).to.not.contain('ipc://');
            break;
          case 'lodestar':
            expect(scriptString).to.contain('--execution.jwtSecret=/path/to/jwt.hex');
            expect(scriptString).to.not.contain('ipc://');
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain('--jwt-secret=/path/to/jwt.hex');
            expect(scriptString).to.not.contain('ipc://');
            break;
          case 'prysm':
            expect(scriptString).to.contain('--jwt-secret=/path/to/jwt.hex');
            expect(scriptString).to.not.contain('ipc://');
            break;
          case 'teku':
            expect(scriptString).to.contain('--ee-jwt-secret-file=/path/to/jwt.hex');
            expect(scriptString).to.not.contain('ipc://');
            break;
        }
      });
    });
  });
}); 
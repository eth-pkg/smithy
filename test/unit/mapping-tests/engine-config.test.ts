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
      //'besu',
      // 'erigon',
      // 'geth',
      // 'nethermind',
       'reth'
    ];

    // TODO: need to test hostAllowlist when it is a list of hosts
    executionClients.forEach(client => {
      it(`should correctly configure engine API for ${client}`, () => {
        const config = {
          ...testConfig,
          commonConfig: {
            ...testConfig.commonConfig,
            engine: {
              enabled: true,
              scheme: 'http' as const,
              host: 'localhost',
              hostAllowlist: 'localhost',
              port: 8551,
              communication: 'jwt' as const,
              url: '{commonConfig.engine.scheme}://{commonConfig.engine.host}:{commonConfig.engine.port}',
              ip: '127.0.0.1',
              jwtFile: '{commonConfig.dataDir}/jwt.hex',
            }
          },
          executionConfig: {
            ...testConfig.executionConfig,
            client: {
              name: client,
              version: ''
            },
          }
        };

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        const jwtFile = `${config.commonConfig.dataDir}/jwt.hex`

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain(`--engine-rpc-enabled`);
            expect(scriptString).to.contain(`--engine-rpc-port=${config.commonConfig.engine.port}`);
            expect(scriptString).to.contain(`--engine-host-allowlist=${config.commonConfig.engine.hostAllowlist}`);
            expect(scriptString).to.contain(`--engine-jwt-secret=${jwtFile}`);
            expect(scriptString).to.not.contain('http://localhost:8551');
            break;
          case 'erigon':
            expect(scriptString).to.contain(`--authrpc.port ${config.commonConfig.engine.port}`);
            expect(scriptString).to.contain(`--authrpc.addr ${config.commonConfig.engine.host}`);
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${jwtFile}`);
            expect(scriptString).to.contain(`--authrpc.vhosts ${config.commonConfig.engine.hostAllowlist}`);
            expect(scriptString).to.contain('--externalcl');
            break;
          case 'geth':
            expect(scriptString).to.contain(`--authrpc.port ${config.commonConfig.engine.port}`);
            expect(scriptString).to.contain(`--authrpc.addr ${config.commonConfig.engine.host}`);
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${jwtFile}`);
            expect(scriptString).to.contain(`--authrpc.vhosts ${config.commonConfig.engine.hostAllowlist}`);
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--JsonRpc.EnginePort ${config.commonConfig.engine.port}`);
            expect(scriptString).to.contain(`--JsonRpc.EngineHost ${config.commonConfig.engine.host}`);
            expect(scriptString).to.contain(`--JsonRpc.JwtSecretFile ${jwtFile}`);
            expect(scriptString).to.contain(`--JsonRpc.EngineEnabledModules ${config.commonConfig.engine.hostAllowlist}`);
            break;
          case 'reth':
            expect(scriptString).to.contain(`--authrpc.port ${config.commonConfig.engine.port}`);
            expect(scriptString).to.contain(`--authrpc.addr ${config.commonConfig.engine.host}`);
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${jwtFile}`);
            // expect(scriptString).to.contain(`--authrpc.vhosts ${config.commonConfig.engine.hostAllowlist}`);
            break;
        }
      });

      const hostAllowlist = [
        "*",
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "::1",
        "::",
        "0.0.0.0",
        "all",
        ["*", "localhost", "127.0.0.1", "0.0.0.0", "::1", "::", "0.0.0.0"].join(','),
        ["all", "localhost", "127.0.0.1", "0.0.0.0", "::1", "::", "0.0.0.0"].join(','),
        ["localhost", "127.0.0.1", "0.0.0.0", "::1", "::", "0.0.0.0"].join(',')
      ];
      hostAllowlist.forEach(host => {
        it(`should correctly configure hostAllowlist=${host} for ${client}`, () => {
          const config = {
            ...testConfig,
            commonConfig: {
              ...testConfig.commonConfig,
              engine: {
                enabled: true,
                scheme: 'http' as const,
                host: 'localhost',
                hostAllowlist: host.toString(),
                port: 8551,
                communication: 'jwt' as const,
                url: '{commonConfig.engine.scheme}://{commonConfig.engine.host}:{commonConfig.engine.port}',
                ip: '127.0.0.1',
                jwtFile: '{commonConfig.dataDir}/jwt.hex',
              }
            },
            executionConfig: {
              ...testConfig.executionConfig,
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
              // Note: Besu does not support mixing '*' or 'all' with other values in engine-host-allowlist
              // This is validated separately in the configuration validation logic
              // So we don't need to test for it here
              expect(scriptString).to.contain(`--engine-host-allowlist="${host}"`)
              break;
            case 'erigon':
              expect(scriptString).to.contain(`--authrpc.vhosts "${host}"`);
              break;
            case 'geth':
              expect(scriptString).to.contain(`--authrpc.vhosts "${host}"`);
              break;
            case 'nethermind':
              expect(scriptString).to.contain(`--JsonRpc.EngineEnabledModules "${host}"`);
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
          commonConfig: {
            ...testConfig.commonConfig,
            engine: {
              enabled: true,
              communication: 'ipc' as const,
              ipcPath: 'ipc:///path/to/ipc.sock',
            }
          },
          executionConfig: {
            ...testConfig.executionConfig,
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
            expect(scriptString).to.contain('--authrpc.jwtsecret');
            break;
          case 'geth':
            expect(scriptString).to.contain(`--ipcpath ${config.commonConfig.engine.ipcPath}`);
            expect(scriptString).to.not.contain('--authrpc.jwtsecret');
            expect(scriptString).to.not.contain('--ipcdisable');
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--JsonRpc.IpcUnixDomainSocketPath ${config.commonConfig.engine.ipcPath}`);
            expect(scriptString).to.not.contain('--JsonRpc.JwtSecretFile');
            expect(scriptString).to.not.contain('--JsonRpc.EngineEnabledModules');
            expect(scriptString).to.not.contain('--JsonRpc.EnginePort');
            expect(scriptString).to.not.contain('--JsonRpc.EngineHost');
            break;
          case 'reth':
            expect(scriptString).to.contain(`--auth-ipc`);
            expect(scriptString).to.contain(`--auth-ipc.path ${config.commonConfig.engine.ipcPath}`);
            expect(scriptString).to.not.contain('--authrpc.jwtsecret');
            expect(scriptString).to.not.contain('--authrpc.addr');
            expect(scriptString).to.not.contain('--authrpc.port');
            break;
        }
      });

      it(`should handle JWT communication mode for ${client}`, () => {
        const config = {
          ...testConfig,
          commonConfig: {
            ...testConfig.commonConfig,
            engine: {
              enabled: true,
              port: 8551,
              communication: 'jwt' as const,
              url: 'http://localhost:8551',
              hostAllowlist: 'localhost',
              host: 'localhost',
              ip: '127.0.0.1',
              jwtFile: '/path/to/jwt.hex',
              scheme: 'http' as const
            }
          },
          executionConfig: {
            ...testConfig.executionConfig,
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
            expect(scriptString).to.contain(`--engine-jwt-secret=${config.commonConfig.engine.jwtFile}`);
            expect(scriptString).to.not.contain('--Xrpc-ipc-enabled');
            break;
          case 'erigon':
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${config.commonConfig.engine.jwtFile}`);
            break;
          case 'geth':
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${config.commonConfig.engine.jwtFile}`);
            expect(scriptString).to.contain('--ipcdisable');
            expect(scriptString).to.not.contain('--ipcpath');
            break;
          case 'nethermind':
            expect(scriptString).to.contain(`--JsonRpc.JwtSecretFile ${config.commonConfig.engine.jwtFile}`);
            expect(scriptString).to.not.contain('--JsonRpc.IpcUnixDomainSocketPath');
            break;
          case 'reth':
            expect(scriptString).to.contain(`--authrpc.jwtsecret ${config.commonConfig.engine.jwtFile}`);
            expect(scriptString).to.not.contain('--auth-ipc');
            expect(scriptString).to.not.contain('--auth-ipc.path');
            break;
        }
      });

    });
  });



  describe.skip('Consensus Client Engine API Configuration', () => {
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
          commonConfig: {
            ...testConfig.commonConfig,
            engine: {
              enabled: true,
              port: 8551,
              communication: 'jwt' as const,
              url: 'http://localhost:8551',
              hostAllowlist: 'localhost',
              host: 'localhost',
              ip: '127.0.0.1',
              jwtFile: '/path/to/jwt.hex',
              scheme: 'http' as const
            }
          },
          consensusConfig: {
            ...testConfig.consensusConfig,
            client: {
              name: client,
              version: ''
            },
          }
        };

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        expect(scriptString).to.contain('http://localhost:8551');
        expect(scriptString).to.contain('/path/to/jwt.hex');

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain('--execution-endpoint=http://localhost:8551');
            expect(scriptString).to.contain('--execution-jwt=/path/to/jwt.hex');
            break;
          case 'lodestar':
            expect(scriptString).to.contain('--execution.urls=http://localhost:8551');
            expect(scriptString).to.contain('--execution.jwtSecret=/path/to/jwt.hex');
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain('--web3-url=http://localhost:8551');
            expect(scriptString).to.contain('--jwt-secret=/path/to/jwt.hex');
            break;
          case 'prysm':
            expect(scriptString).to.contain('--execution-endpoint=http://localhost:8551');
            expect(scriptString).to.contain('--jwt-secret=/path/to/jwt.hex');
            break;
          case 'teku':
            expect(scriptString).to.contain('--ee-endpoint=http://localhost:8551');
            expect(scriptString).to.contain('--ee-jwt-secret-file=/path/to/jwt.hex');
            break;
        }
      });

      it(`should handle IPC communication mode for ${client}`, () => {
        const config = {
          ...testConfig,
          commonConfig: {
            ...testConfig.commonConfig,
            engine: {
              enabled: true,
              communication: 'ipc' as const,
              ipcPath: 'ipc:///path/to/ipc.sock',
            }
          },
          consensusConfig: {
            ...testConfig.consensusConfig,
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

      it(`should handle JWT communication mode for ${client}`, () => {
        const config = {
          ...testConfig,
          commonConfig: {
            ...testConfig.commonConfig,
            engine: {
              enabled: true,
              port: 8551,
              communication: 'jwt' as const,
              url: 'http://localhost:8551',
              host: 'localhost',
              hostAllowlist: 'localhost',
              ip: '127.0.0.1',
              jwtFile: '/path/to/jwt.hex',
              scheme: 'http' as const
            }
          },
          consensusConfig: {
            ...testConfig.consensusConfig,
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

      it(`should handle custom engine API configuration for ${client}`, () => {
        const config = {
          ...testConfig,
          commonConfig: {
            ...testConfig.commonConfig,
            engine: {
              enabled: true,
              port: 9999,
              communication: 'jwt' as const,
              url: 'http://custom.host:9999',
              host: 'custom.host',
              hostAllowlist: 'custom.host',
              ip: '192.168.1.1',
              jwtFile: '/custom/path/jwt.hex',
              scheme: 'https' as const
            }
          },
          consensusConfig: {
            ...testConfig.consensusConfig,
            client: {
              name: client,
              version: ''
            },
          }
        };
        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        expect(scriptString).to.contain('https://custom.host:9999');
        expect(scriptString).to.contain('/custom/path/jwt.hex');

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain('--execution-endpoint=https://custom.host:9999');
            expect(scriptString).to.contain('--execution-jwt=/custom/path/jwt.hex');
            break;
          case 'lodestar':
            expect(scriptString).to.contain('--execution.urls=https://custom.host:9999');
            expect(scriptString).to.contain('--execution.jwtSecret=/custom/path/jwt.hex');
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain('--web3-url=https://custom.host:9999');
            expect(scriptString).to.contain('--jwt-secret=/custom/path/jwt.hex');
            break;
          case 'prysm':
            expect(scriptString).to.contain('--execution-endpoint=https://custom.host:9999');
            expect(scriptString).to.contain('--jwt-secret=/custom/path/jwt.hex');
            break;
          case 'teku':
            expect(scriptString).to.contain('--ee-endpoint=https://custom.host:9999');
            expect(scriptString).to.contain('--ee-jwt-secret-file=/custom/path/jwt.hex');
            break;
        }
      });
    });
  });
}); 
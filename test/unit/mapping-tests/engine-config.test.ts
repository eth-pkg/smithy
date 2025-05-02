import { expect } from 'chai';
import { CommandClientRegistry } from '@/lib/builders/command/command-client-registry';
import { ExecutionClientName, ConsensusClientName } from '@/lib/types';
import { testConfig } from '../preset-tests/network-preset.test-helper';

describe.skip('Engine Configuration Tests', () => {
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

    executionClients.forEach(client => {
      it(`should correctly configure engine API for ${client}`, () => {
        const config = {
          ...testConfig,
          commonConfig: {
            ...testConfig.commonConfig,
            clients: { ...testConfig.commonConfig.clients, execution: client },
            engine: {
              apiPort: 8551,
              communication: 'jwt' as const,
              endpointUrl: 'http://localhost:8551',
              host: 'localhost',
              ip: '127.0.0.1',
              jwtFile: '/path/to/jwt.hex',
              scheme: 'http' as const
            }
          }
        };

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        expect(scriptString).to.contain('8551');
        expect(scriptString).to.contain('/path/to/jwt.hex');
        expect(scriptString).to.contain('http://localhost:8551');

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--engine-rpc-port=8551');
            expect(scriptString).to.contain('--engine-host-allowlist=localhost');
            expect(scriptString).to.contain('--engine-jwt-secret=/path/to/jwt.hex');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--authrpc.port=8551');
            expect(scriptString).to.contain('--authrpc.addr=127.0.0.1');
            expect(scriptString).to.contain('--authrpc.jwtsecret=/path/to/jwt.hex');
            break;
          case 'geth':
            expect(scriptString).to.contain('--authrpc.port=8551');
            expect(scriptString).to.contain('--authrpc.addr=127.0.0.1');
            expect(scriptString).to.contain('--authrpc.jwtsecret=/path/to/jwt.hex');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--JsonRpc.Port=8551');
            expect(scriptString).to.contain('--JsonRpc.Host=127.0.0.1');
            expect(scriptString).to.contain('--JsonRpc.JwtSecretFile=/path/to/jwt.hex');
            break;
          case 'reth':
            expect(scriptString).to.contain('--authrpc.port=8551');
            expect(scriptString).to.contain('--authrpc.addr=127.0.0.1');
            expect(scriptString).to.contain('--authrpc.jwtsecret=/path/to/jwt.hex');
            break;
        }
      });

      it(`should handle IPC communication mode for ${client}`, () => {
        const config = {
          ...testConfig,
          commonConfig: {
            ...testConfig.commonConfig,
            clients: { ...testConfig.commonConfig.clients, execution: client },
            engine: {
              apiPort: 8551,
              communication: 'ipc' as const,
              endpointUrl: 'ipc:///path/to/ipc.sock',
              host: 'localhost',
              ip: '127.0.0.1',
              scheme: 'http' as const
            }
          }
        };

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--engine-rpc-ipc-enabled=true');
            expect(scriptString).to.contain('--engine-rpc-ipc-path=/path/to/ipc.sock');
            expect(scriptString).to.not.contain('--engine-jwt-secret');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--authrpc.ipcpath=/path/to/ipc.sock');
            expect(scriptString).to.not.contain('--authrpc.jwtsecret');
            break;
          case 'geth':
            expect(scriptString).to.contain('--authrpc.ipcpath=/path/to/ipc.sock');
            expect(scriptString).to.not.contain('--authrpc.jwtsecret');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--JsonRpc.IpcPath=/path/to/ipc.sock');
            expect(scriptString).to.not.contain('--JsonRpc.JwtSecretFile');
            break;
          case 'reth':
            expect(scriptString).to.contain('--authrpc.ipcpath=/path/to/ipc.sock');
            expect(scriptString).to.not.contain('--authrpc.jwtsecret');
            break;
        }
      });

      it(`should handle JWT communication mode for ${client}`, () => {
        const config = {
          ...testConfig,
          commonConfig: {
            ...testConfig.commonConfig,
            clients: { ...testConfig.commonConfig.clients, execution: client },
            engine: {
              apiPort: 8551,
              communication: 'jwt' as const,
              endpointUrl: 'http://localhost:8551',
              host: 'localhost',
              ip: '127.0.0.1',
              jwtFile: '/path/to/jwt.hex',
              scheme: 'http' as const
            }
          }
        };

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--engine-jwt-secret=/path/to/jwt.hex');
            expect(scriptString).to.not.contain('--engine-rpc-ipc-enabled');
            expect(scriptString).to.not.contain('--engine-rpc-ipc-path');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--authrpc.jwtsecret=/path/to/jwt.hex');
            expect(scriptString).to.not.contain('--authrpc.ipcpath');
            break;
          case 'geth':
            expect(scriptString).to.contain('--authrpc.jwtsecret=/path/to/jwt.hex');
            expect(scriptString).to.not.contain('--authrpc.ipcpath');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--JsonRpc.JwtSecretFile=/path/to/jwt.hex');
            expect(scriptString).to.not.contain('--JsonRpc.IpcPath');
            break;
          case 'reth':
            expect(scriptString).to.contain('--authrpc.jwtsecret=/path/to/jwt.hex');
            expect(scriptString).to.not.contain('--authrpc.ipcpath');
            break;
        }
      });

      it(`should handle custom engine API configuration for ${client}`, () => {
        const config = {
          ...testConfig,
          commonConfig: {
            ...testConfig.commonConfig,
            clients: { ...testConfig.commonConfig.clients, execution: client },
            engine: {
              apiPort: 9999,
              communication: 'jwt' as const,
              endpointUrl: 'http://custom.host:9999',
              host: 'custom.host',
              ip: '192.168.1.1',
              jwtFile: '/custom/path/jwt.hex',
              scheme: 'https' as const
            }
          }
        };

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        expect(scriptString).to.contain('9999');
        expect(scriptString).to.contain('/custom/path/jwt.hex');
        expect(scriptString).to.contain('https://custom.host:9999');

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--engine-rpc-port=9999');
            expect(scriptString).to.contain('--engine-host-allowlist=custom.host');
            expect(scriptString).to.contain('--engine-jwt-secret=/custom/path/jwt.hex');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--authrpc.port=9999');
            expect(scriptString).to.contain('--authrpc.addr=192.168.1.1');
            expect(scriptString).to.contain('--authrpc.jwtsecret=/custom/path/jwt.hex');
            break;
          case 'geth':
            expect(scriptString).to.contain('--authrpc.port=9999');
            expect(scriptString).to.contain('--authrpc.addr=192.168.1.1');
            expect(scriptString).to.contain('--authrpc.jwtsecret=/custom/path/jwt.hex');
            break;
          case 'nethermind':
            expect(scriptString).to.contain('--JsonRpc.Port=9999');
            expect(scriptString).to.contain('--JsonRpc.Host=192.168.1.1');
            expect(scriptString).to.contain('--JsonRpc.JwtSecretFile=/custom/path/jwt.hex');
            break;
          case 'reth':
            expect(scriptString).to.contain('--authrpc.port=9999');
            expect(scriptString).to.contain('--authrpc.addr=192.168.1.1');
            expect(scriptString).to.contain('--authrpc.jwtsecret=/custom/path/jwt.hex');
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
          commonConfig: {
            ...testConfig.commonConfig,
            clients: { ...testConfig.commonConfig.clients, consensus: client },
            engine: {
              apiPort: 8551,
              communication: 'jwt' as const,
              endpointUrl: 'http://localhost:8551',
              host: 'localhost',
              ip: '127.0.0.1',
              jwtFile: '/path/to/jwt.hex',
              scheme: 'http' as const
            }
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
            clients: { ...testConfig.commonConfig.clients, consensus: client },
            engine: {
              apiPort: 8551,
              communication: 'ipc' as const,
              endpointUrl: 'ipc:///path/to/ipc.sock',
              host: 'localhost',
              ip: '127.0.0.1',
              scheme: 'http' as const
            }
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
            clients: { ...testConfig.commonConfig.clients, consensus: client },
            engine: {
              apiPort: 8551,
              communication: 'jwt' as const,
              endpointUrl: 'http://localhost:8551',
              host: 'localhost',
              ip: '127.0.0.1',
              jwtFile: '/path/to/jwt.hex',
              scheme: 'http' as const
            }
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
            clients: { ...testConfig.commonConfig.clients, consensus: client },
            engine: {
              apiPort: 9999,
              communication: 'jwt' as const,
              endpointUrl: 'http://custom.host:9999',
              host: 'custom.host',
              ip: '192.168.1.1',
              jwtFile: '/custom/path/jwt.hex',
              scheme: 'https' as const
            }
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
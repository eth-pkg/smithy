import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ConsensusClientName, DeepPartial, NodeConfig } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import { deepMerge } from '@test/fixtures/deepMerge.fixture';

describe('Consensus Client Builder Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const consensusClients: ConsensusClientName[] = [
    'lighthouse',
    "lodestar",
    'nimbus-eth2',
    'prysm',
    'teku',
  ];

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  consensusClients.forEach(client => {
    describe(`${client} builder configuration`, () => {
      it('should include builder flags when builder is enabled', () => {
        const config: NodeConfig = deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            http: {
              enabled: false
            },
            client: {
              name: client,
              version: ''
            },
            builder: {
              enabled: true,
              url: 'http://localhost:18550',
              userAgent: 'test-user-agent',
              enableSSZ: true
            }
          }
        } as DeepPartial<NodeConfig>);

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const builderUrl = config.consensus?.builder?.url;
        const builderUserAgent = config.consensus?.builder?.userAgent;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.include('--disable-builder-ssz');
            expect(scriptString).to.include(`--builder ${builderUrl}`);
            expect(scriptString).to.include(`--builder-user-agent ${builderUserAgent}`);
            break;
          case 'lodestar':
            expect(scriptString).to.include('--builder');
            expect(scriptString).to.include(`--builder.url ${builderUrl}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.include('--payload-builder');
            expect(scriptString).to.include(`--payload-builder-url ${builderUrl}`);
            break;
          case 'prysm':
            expect(scriptString).to.include('--enable-builder-ssz');
            expect(scriptString).to.include(`--http-mev-relay ${builderUrl}`);
            break;
          case 'teku':
            expect(scriptString).to.include(`--builder-endpoint=${builderUrl}`);
            expect(scriptString).to.include(`--builder-set-user-agent-header=${builderUserAgent}`);
            break;
        }
      });

      it('should not include any builder flags when builder is disabled', () => {
        const config: NodeConfig = deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          consensus: {
            http: {
              enabled: false
            },
            client: {
              name: client,
              version: ''
            },
            builder: {
              enabled: false,
              url: 'http://localhost:18550',
              userAgent: 'test-user-agent',
              enableSSZ: true
            }
          }
        } as DeepPartial<NodeConfig>);

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const builderUrl = config.consensus?.builder?.url;
        const builderUserAgent = config.consensus?.builder?.userAgent;
        const builderEnabled = config.consensus?.builder?.enabled;

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.include('--disable-builder-ssz');
            expect(scriptString).to.not.include(`--builder ${builderUrl}`);
            expect(scriptString).to.not.include(`--builder-user-agent ${builderUserAgent}`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.include('--builder');
            expect(scriptString).to.not.include(`--builder.url ${builderUrl}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.include('--payload-builder');
            expect(scriptString).to.not.include(`--payload-builder-url ${builderUrl}`);
            break;
          case 'prysm':
            expect(scriptString).to.not.include('--enable-builder-ssz');
            expect(scriptString).to.not.include(`--http-mev-relay ${builderUrl}`);
            break;
          case 'teku':
            expect(scriptString).to.not.include(`--builder-endpoint=${builderUrl}`);
            expect(scriptString).to.not.include(`--builder-set-user-agent-header=${builderUserAgent}`);
            break;
        }
      });
    });
  });
}); 
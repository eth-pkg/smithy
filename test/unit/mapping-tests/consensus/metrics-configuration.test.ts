import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ConsensusClientName } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe('Consensus Client Metrics Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const schemaUtils = new SchemaUtils('');
  const consensusClients: ConsensusClientName[] = [
    'lighthouse',
    'lodestar',
    'nimbus-eth2',
    'prysm',
    'teku',
  ];

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  consensusClients.forEach(client => {
    describe(`${client} metrics configuration`, () => {
      it('should include any metrics flags when metrics is enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
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
            metrics: {
              enabled: true,
              port: 6060,
              address: 'localhost'
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const metricsPort = config.consensus.metrics.port;
        const metricsAddress = config.consensus.metrics.address;

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.contain('--metrics');
            expect(scriptString).to.contain(`--metrics-address ${metricsAddress}`);
            expect(scriptString).to.contain(`--metrics-port ${metricsPort}`);
            break;
          case 'lodestar':
            expect(scriptString).to.contain('--metrics');
            expect(scriptString).to.contain(`--metrics.port ${metricsPort}`);
            expect(scriptString).to.contain(`--metrics.address ${metricsAddress}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.contain('--metrics');
            expect(scriptString).to.contain(`--metrics-address ${metricsAddress}`);
            expect(scriptString).to.contain(`--metrics-port ${metricsPort}`);
            break;
          case 'prysm':
            expect(scriptString).to.not.contain(`--disable-monitoring`);
            expect(scriptString).to.contain(`--monitoring-host ${metricsAddress}`);
            // TODO: could not find monitoring port in the script
            break;
          case 'teku':
            expect(scriptString).to.contain(`--metrics-enabled`);
            expect(scriptString).to.contain(`--metrics-interface=${metricsAddress}`);
            expect(scriptString).to.contain(`--metrics-port=${metricsPort}`);
            break;
        }
      });

      it('should not include any metrics flags when metrics is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
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
            metrics: {
              enabled: false,
              port: 6060,
              address: 'localhost'
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const metricsPort = config.consensus.metrics.port;
        const metricsAddress = config.consensus.metrics.address;

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.contain('--metrics');
            expect(scriptString).to.not.contain(`--metrics-address ${metricsAddress}`);
            expect(scriptString).to.not.contain(`--metrics-port ${metricsPort}`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.contain('--metrics');
            expect(scriptString).to.not.contain(`--metrics.port ${metricsPort}`);
            expect(scriptString).to.not.contain(`--metrics.address ${metricsAddress}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.contain('--metrics');
            expect(scriptString).to.not.contain(`--metrics-address ${metricsAddress}`);
            expect(scriptString).to.not.contain(`--metrics-port ${metricsPort}`);
            break;
          case 'prysm':
            expect(scriptString).to.contain(`--disable-monitoring`);
            expect(scriptString).to.not.contain(`--monitoring-host ${metricsAddress}`);
            // TODO: could not find monitoring port in the script
            break;
          case 'teku':
            expect(scriptString).to.not.contain(`--metrics-enabled`);
            expect(scriptString).to.not.contain(`--metrics-interface=${metricsAddress}`);
            expect(scriptString).to.not.contain(`--metrics-port=${metricsPort}`);
            break;
        }
      });
    });
  });
}); 
import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ValidatorClientName } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe('Validator Client Metrics Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const schemaUtils = new SchemaUtils('');
  const validatorClients: ValidatorClientName[] = [
    'lighthouse',
    'lodestar',
    'nimbus-eth2',
    'prysm',
    'teku',
  ];

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  validatorClients.forEach(client => {
    describe(`${client} metrics configuration`, () => {
      it('should correctly map metrics configuration when enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: ''
            },
            enabled: true,
            metrics: {
              enabled: true,
              host: '127.0.0.1',
              port: 8008
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const metricsHost = config.validator.metrics.host;
        const metricsPort = config.validator.metrics.port;

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.include('--metrics');
            expect(scriptString).to.include(`--metrics-address ${metricsHost}`);
            expect(scriptString).to.include(`--metrics-port ${metricsPort}`);
            break;
          case 'lodestar':
            expect(scriptString).to.include('--metrics');
            expect(scriptString).to.include(`--metrics.address ${metricsHost}`);
            expect(scriptString).to.include(`--metrics.port ${metricsPort}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.include('--metrics');
            expect(scriptString).to.include(`--metrics-address ${metricsHost}`);
            expect(scriptString).to.include(`--metrics-port ${metricsPort}`);
            break;
          case 'prysm':
            expect(scriptString).to.include(`--monitoring-host ${metricsHost}`);
            expect(scriptString).to.include(`--monitoring-port ${metricsPort}`);
            break;
          case 'teku':
            expect(scriptString).to.include('--metrics-enabled');
            expect(scriptString).to.include(`--metrics-interface=${metricsHost}`);
            expect(scriptString).to.include(`--metrics-port=${metricsPort}`);
            break;
        }
      });

      it('should not include metrics flags when metrics are disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: ''
            },
            enabled: true,
            metrics: {
              enabled: false,
              host: '127.0.0.1',
              port: 8008
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.include('--metrics');
            expect(scriptString).to.not.include('--metrics-address');
            expect(scriptString).to.not.include('--metrics-port');
            break;
          case 'lodestar':
            expect(scriptString).to.not.include('--metrics');
            expect(scriptString).to.not.include('--metrics.address');
            expect(scriptString).to.not.include('--metrics.port');
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.include('--metrics');
            expect(scriptString).to.not.include('--metrics-address');
            expect(scriptString).to.not.include('--metrics-port');
            break;
          case 'prysm':
            expect(scriptString).to.not.include('--monitoring-host');
            expect(scriptString).to.not.include('--monitoring-port');
            break;
          case 'teku':
            expect(scriptString).to.not.include('--metrics-enabled');
            expect(scriptString).to.not.include('--metrics-interface');
            expect(scriptString).to.not.include('--metrics-port');
            break;
        }
      });

      it('should not include metrics flags when validator is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: ''
            },
            enabled: false,
            metrics: {
              enabled: true,
              host: '127.0.0.1',
              port: 8008
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.include('--metrics');
            expect(scriptString).to.not.include('--metrics-address');
            expect(scriptString).to.not.include('--metrics-port');
            break;
          case 'lodestar':
            expect(scriptString).to.not.include('--metrics');
            expect(scriptString).to.not.include('--metrics.address');
            expect(scriptString).to.not.include('--metrics.port');
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.include('--metrics');
            expect(scriptString).to.not.include('--metrics-address');
            expect(scriptString).to.not.include('--metrics-port');
            break;
          case 'prysm':
            expect(scriptString).to.not.include('--monitoring-host');
            expect(scriptString).to.not.include('--monitoring-port');
            break;
          case 'teku':
            expect(scriptString).to.not.include('--metrics-enabled');
            expect(scriptString).to.not.include('--metrics-interface');
            expect(scriptString).to.not.include('--metrics-port');
            break;
        }
      });
    });
  });
}); 
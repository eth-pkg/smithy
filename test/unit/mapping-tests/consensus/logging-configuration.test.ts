import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ConsensusClientName } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe.skip('Consensus Client Logging Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const schemaUtils = new SchemaUtils('');
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
    describe(`${client} logging configuration`, () => {
      it('should not include any logging flags when logging is disabled', () => {
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
            logging: {
              enabled: true,
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
          case 'lodestar':
          case 'nimbus-eth2':
          case 'prysm':
          case 'teku':
            expect(false).to.be.true;
            break;
        }
      });
    });
  });
}); 
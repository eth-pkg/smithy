import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ConsensusClientName, ValidatorClientName } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe.skip('Validator Client Graffiti Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const schemaUtils = new SchemaUtils('');
  const validatorClients: ValidatorClientName[] = [
    'lighthouse',
    "lodestar",
    'nimbus-eth2',
    'prysm',
    'teku',
  ];

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  validatorClients.forEach(client => {
    describe(`${client} graffiti configuration`, () => {
      it('should not include any graffiti flags when graffiti is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          common: {
            engine: {
              enabled: false
            }
          },
          validator: {
            client: {
              name: client,
              version: ''
            },
            graffiti: {
              enabled: true,
              message: 'test'
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const graffitiMessage = config.consensus.graffiti.message;

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.include(`--graffiti ${graffitiMessage}`);
          case 'lodestar':
            expect(scriptString).to.not.include(`--graffiti ${graffitiMessage}`);
          case 'nimbus-eth2':
            expect(scriptString).to.include(`--graffiti ${graffitiMessage}`);
          case 'prysm':
            expect(scriptString).to.not.include(`--graffiti ${graffitiMessage}`);
          case 'teku':
            expect(scriptString).to.include(`--validators-graffiti ${graffitiMessage}`);
            break;
        }
      });
    });
  });
}); 
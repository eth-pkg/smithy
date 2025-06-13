import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ValidatorClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import SchemaUtils from '@/utils/schema';

describe('Validator Client Proposer Configuration Tests', () => {
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
    describe(`${client} proposer configuration`, () => {
      it('should correctly map proposer configuration when enabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: ''
            },
            enabled: true,
            proposerConfig: {
              enabled: true,
              file: '/path/to/proposer.json'
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'lighthouse':
            // Lighthouse doesn't have a specific proposer config file flag
            break;
          case 'lodestar':
            expect(scriptString).to.include('--proposerSettingsFile /path/to/proposer.json');
            break;
          case 'nimbus-eth2':
            // Nimbus doesn't support proposer config file
            break;
          case 'prysm':
            expect(scriptString).to.include('--proposer-settings-file /path/to/proposer.json');
            break;
          case 'teku':
            expect(scriptString).to.include('--validators-proposer-config=/path/to/proposer.json');
            break;
        }
      });

      it('should not include proposer config flags when disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: ''
            },
            enabled: true,
            proposerConfig: {
              enabled: false,
              file: '/path/to/proposer.json'
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        // All clients should not include proposer config flags when disabled
        expect(scriptString).to.not.include('--proposerSettingsFile');
        expect(scriptString).to.not.include('--proposer-settings-file');
        expect(scriptString).to.not.include('--validators-proposer-config');
      });
    });
  });
}); 
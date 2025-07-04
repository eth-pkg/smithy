import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ValidatorClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import SchemaUtils from '@/nodeconfig/schema';

describe('Validator Client Basic Configuration Tests', () => {
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
    describe(`${client} basic configuration`, () => {
      it('should correctly map all basic configuration flags', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: ''
            },
            enabled: true,
            isExternal: true,
            dataDir: '/test/data/dir',
            beaconNodes: ['http://localhost:5052', 'http://localhost:5053'],
            suggestFeeRecipientAddress: '0x1234567890123456789012345678901234567890',
            validatorsDir: '/test/validators',
            secretsDir: '/test/secrets',
            distributed: true,
            suggestedGasLimit: 30000000,
            doppelgangerProtection: true
          }
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const dataDir = config.validator.dataDir;
        const beaconNodes = config.validator.beaconNodes.join(',');
        const suggestFeeRecipientAddress = config.validator.suggestFeeRecipientAddress;
        const validatorsDir = config.validator.validatorsDir;
        const secretsDir = config.validator.secretsDir;
        const suggestedGasLimit = config.validator.suggestedGasLimit;

        switch (client) {
          case 'lighthouse':
            console.log(scriptString);
            expect(scriptString).to.include(`--datadir ${dataDir}`);
            expect(scriptString).to.include(`--beacon-nodes ${beaconNodes}`);
            expect(scriptString).to.include(`--suggested-fee-recipient ${suggestFeeRecipientAddress}`);
            expect(scriptString).to.include(`--validators-dir ${validatorsDir}`);
            expect(scriptString).to.include(`--secrets-dir ${secretsDir}`);
            expect(scriptString).to.include(`--distributed`);
            expect(scriptString).to.include(`--gas-limit ${suggestedGasLimit}`);
            expect(scriptString).to.include(`--enable-doppelganger-protection`);
            break;
          case 'lodestar':
            expect(scriptString).to.include(`--dataDir ${dataDir}`);
            expect(scriptString).to.include(`--beaconNodes ${beaconNodes}`);
            expect(scriptString).to.include(`--suggestedFeeRecipient ${suggestFeeRecipientAddress}`);
            expect(scriptString).to.include(`--importKeystores ${validatorsDir}`);
            expect(scriptString).to.include(`--importKeystoresPassword ${secretsDir}`);
            expect(scriptString).to.include(`--distributed`);
            expect(scriptString).to.include(`--suggestedFeeRecipient ${suggestFeeRecipientAddress}`);
            expect(scriptString).to.include(`--doppelgangerProtection`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.include(`--data-dir ${dataDir}`);
            expect(scriptString).to.include(`--beacon-node ${beaconNodes}`);
            expect(scriptString).to.include(`--suggested-fee-recipient ${suggestFeeRecipientAddress}`);
            expect(scriptString).to.include(`--validators-dir ${validatorsDir}`);
            expect(scriptString).to.include(`--secrets-dir ${secretsDir}`);
            // expect(scriptString).to.include(`--distributed`);
            expect(scriptString).to.include(`--suggested-gas-limit ${suggestedGasLimit}`);
            expect(scriptString).to.include(`--doppelganger-detection`);
            break;
          case 'prysm':
            expect(scriptString).to.include(`--datadir ${dataDir}`);
            expect(scriptString).to.include(`--beacon-rpc-provider ${beaconNodes}`);
            expect(scriptString).to.include(`--suggested-fee-recipient ${suggestFeeRecipientAddress}`);
            expect(scriptString).to.include(`--wallet-dir ${validatorsDir}`);
            expect(scriptString).to.include(`--wallet-password-file ${secretsDir}`);
            expect(scriptString).to.include(`--distributed`);
            expect(scriptString).to.include(`--suggested-gas-limit ${suggestedGasLimit}`);
            expect(scriptString).to.include(`--enable-doppelganger`);
            break;
          case 'teku':
            // Teku data dir mapping is not specified in the docs
            expect(scriptString).to.include(`--beacon-node-api-endpoint=${beaconNodes}`);
            expect(scriptString).to.include(`--validators-proposer-default-fee-recipient=${suggestFeeRecipientAddress}`);
            expect(scriptString).to.include(`--validator-keys=${validatorsDir}`);
            // Teku secrets dir mapping is not specified in the docs
            // Teku distributed mode is not specified in the docs
            // Teku gas limit mapping is not specified in the docs
            expect(scriptString).to.include(`--doppelganger-detection-enabled`);
            break;
        }
      });
      it('should not map basic configuration flags when disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: ''
            },
            enabled: false,
            isExternal: true,
            dataDir: '/test/data/dir',
            beaconNodes: ['http://localhost:5052', 'http://localhost:5053'],
            suggestFeeRecipientAddress: '0x1234567890123456789012345678901234567890',
            validatorsDir: '/test/validators',
            secretsDir: '/test/secrets',
            distributed: true,
            suggestedGasLimit: 30000000,
            doppelgangerProtection: true
          }
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const dataDir = config.validator.dataDir;
        const beaconNodes = config.validator.beaconNodes.join(',');
        const suggestFeeRecipientAddress = config.validator.suggestFeeRecipientAddress;
        const validatorsDir = config.validator.validatorsDir;
        const secretsDir = config.validator.secretsDir;
        const suggestedGasLimit = config.validator.suggestedGasLimit;

        switch (client) {
          case 'lighthouse':
            console.log(scriptString);
            expect(scriptString).to.not.include(`--datadir ${dataDir}`);
            expect(scriptString).to.not.include(`--beacon-nodes ${beaconNodes}`);
            expect(scriptString).to.not.include(`--suggested-fee-recipient ${suggestFeeRecipientAddress}`);
            expect(scriptString).to.not.include(`--validators-dir ${validatorsDir}`);
            expect(scriptString).to.not.include(`--secrets-dir ${secretsDir}`);
            expect(scriptString).to.not.include(`--distributed`);
            expect(scriptString).to.not.include(`--gas-limit ${suggestedGasLimit}`);
            expect(scriptString).to.not.include(`--enable-doppelganger-protection`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.include(`--dataDir ${dataDir}`);
            expect(scriptString).to.not.include(`--beaconNodes ${beaconNodes}`);
            expect(scriptString).to.not.include(`--suggestedFeeRecipient ${suggestFeeRecipientAddress}`);
            expect(scriptString).to.not.include(`--importKeystores ${validatorsDir}`);
            expect(scriptString).to.not.include(`--importKeystoresPassword ${secretsDir}`);
            expect(scriptString).to.not.include(`--distributed`);
            expect(scriptString).to.not.include(`--suggestedFeeRecipient ${suggestFeeRecipientAddress}`);
            expect(scriptString).to.not.include(`--doppelgangerProtection`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.not.include(`--data-dir ${dataDir}`);
            expect(scriptString).to.not.include(`--beacon-node ${beaconNodes}`);
            expect(scriptString).to.not.include(`--suggested-fee-recipient ${suggestFeeRecipientAddress}`);
            expect(scriptString).to.not.include(`--validators-dir ${validatorsDir}`);
            expect(scriptString).to.not.include(`--secrets-dir ${secretsDir}`);
            // expect(scriptString).to.include(`--distributed`);
            expect(scriptString).to.not.include(`--suggested-gas-limit ${suggestedGasLimit}`);
            expect(scriptString).to.not.include(`--doppelganger-detection`);
            break;
          case 'prysm':
            expect(scriptString).to.not.include(`--datadir ${dataDir}`);
            expect(scriptString).to.not.include(`--beacon-rpc-provider ${beaconNodes}`);
            expect(scriptString).to.not.include(`--suggested-fee-recipient ${suggestFeeRecipientAddress}`);
            expect(scriptString).to.not.include(`--wallet-dir ${validatorsDir}`);
            expect(scriptString).to.not.include(`--wallet-password-file ${secretsDir}`);
            expect(scriptString).to.not.include(`--distributed`);
            expect(scriptString).to.not.include(`--suggested-gas-limit ${suggestedGasLimit}`);
            expect(scriptString).to.not.include(`--enable-doppelganger`);
            break;
          case 'teku':
            // Teku data dir mapping is not specified in the docs
            expect(scriptString).to.not.include(`--beacon-node-api-endpoint=${beaconNodes}`);
            expect(scriptString).to.not.include(`--validators-proposer-default-fee-recipient=${suggestFeeRecipientAddress}`);
            // TODO teku maps the dirs differently, this is not correct
            // check for other clients as well 
            expect(scriptString).to.not.include(`--validator-keys=${validatorsDir}`);
            // Teku secrets dir mapping is not specified in the docs
            // Teku distributed mode is not specified in the docs
            // Teku gas limit mapping is not specified in the docs
            expect(scriptString).to.not.include(`--doppelganger-detection-enabled`);
            break;
        }
      });
    
    });
  });
}); 
import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ConsensusClientName, DeepPartial, NodeConfig } from '@/lib/types';
import { testConfig } from '@test/fixtures/configs';
import SchemaUtils from '@/utils/schema';

describe('Consensus Client Genesis Configuration Tests', () => {
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
    describe(`${client} genesis configuration`, () => {
      it('should include any genesis flags when genesis is enabled', () => {
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
            genesisSync: {
              enabled: true,
              url: "https://beacon-api.mainnet.dappnode.io",
              state: "genesis.ssz"
            }
          }
        } as DeepPartial<NodeConfig>);

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const genesisSyncUrl = config.consensus?.genesisSync?.url;
        const genesisSyncState = config.consensus?.genesisSync?.state;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.include(`--genesis-state-url ${genesisSyncUrl}`);
            break;
          case 'lodestar':
            // TODO: there is both url and state as one flag, I think we should only allow one of them
            expect(scriptString).to.include(`--genesisStateFile ${genesisSyncUrl}`);
            expect(scriptString).to.include(`--genesisStateFile ${genesisSyncState}`);
            break;
          case 'nimbus-eth2':
            // TODO: there is both url and state as one flag, I think we should only allow one of them
            expect(scriptString).to.include(`--genesis-state ${genesisSyncState}`);
            expect(scriptString).to.include(`--genesis-state-url ${genesisSyncUrl}`);
            break;
          case 'prysm':
            expect(scriptString).to.include(`--genesis-state ${genesisSyncState}`);
            expect(scriptString).to.include(`--genesis-beacon-api-url ${genesisSyncUrl}`);
            break;
          case 'teku':
            // TODO: there is both url and state as one flag, I think we should only allow one of them
            expect(scriptString).to.include(`--genesis-state=${genesisSyncState}`);
            expect(scriptString).to.include(`--genesis-state=${genesisSyncUrl}`);
            break;
        }
      });
      it('should not include any genesis flags when genesis is disabled', () => {
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
            genesisSync: {
              enabled: false,
              url: "https://beacon-api.mainnet.dappnode.io",
              state: "genesis.ssz"
            }
          }
        } as DeepPartial<NodeConfig>);

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const genesisSyncUrl = config.consensus?.genesisSync?.url;
        const genesisSyncState = config.consensus?.genesisSync?.state;
        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.not.include(`--genesis-state-url ${genesisSyncUrl}`);
            break;
          case 'lodestar':
            // TODO: there is both url and state as one flag, I think we should only allow one of them
            expect(scriptString).to.not.include(`--genesisStateFile ${genesisSyncUrl}`);
            expect(scriptString).to.not.include(`--genesisStateFile ${genesisSyncState}`);
            break;
          case 'nimbus-eth2':
            // TODO: there is both url and state as one flag, I think we should only allow one of them
            expect(scriptString).to.not.include(`--genesis-state ${genesisSyncState}`);
            expect(scriptString).to.not.include(`--genesis-state-url ${genesisSyncUrl}`);
            break;
          case 'prysm':
            expect(scriptString).to.not.include(`--genesis-state ${genesisSyncState}`);
            expect(scriptString).to.not.include(`--genesis-beacon-api-url ${genesisSyncUrl}`);
            break;
          case 'teku':
            // TODO: there is both url and state as one flag, I think we should only allow one of them
            expect(scriptString).to.not.include(`--genesis-state=${genesisSyncState}`);
            expect(scriptString).to.not.include(`--genesis-state=${genesisSyncUrl}`);
            break;
        }
      });
    });
  });
}); 
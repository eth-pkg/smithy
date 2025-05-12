import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ConsensusClientName, DeepPartial, NodeConfig } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
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
        console.log(config.consensus?.genesisSync);
        console.log(scriptString);
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
    });
  });
}); 
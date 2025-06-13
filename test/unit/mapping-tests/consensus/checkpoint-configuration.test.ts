import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ConsensusClientName, DeepPartial, NodeConfig } from '@/lib/types';
import SchemaUtils from '@/utils/schema';
import { testConfig } from '@test/fixtures/configs';

describe('Consensus Client Checkpoint Configuration Tests', () => {
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
    describe(`${client} checkpoint configuration`, () => {
      it('should include any checkpoint flags when checkpoint is enabled', () => {
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
            checkpointSync: {
              enabled: true,
              url: 'http://localhost:5052',
              block: '0x1234567890abcdef',
              state: 'genesis.ssz',
              ignoreWeakSubjectivityPeriod: true,
              force: true,
              wss: "block_root:epoch"
            }
          }
        } as DeepPartial<NodeConfig>);

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const checkpointSyncUrl = config.consensus?.checkpointSync?.url;
        const checkpointSyncState = config.consensus?.checkpointSync?.state;
        const checkpointSyncWss = config.consensus?.checkpointSync?.wss;
        const checkpointSyncBlock = config.consensus?.checkpointSync?.block;
        switch (client) {
          case 'lighthouse':
            // expect(scriptString).to.not.include('--checkpoint-blobs');
            expect(scriptString).to.include(`--checkpoint-block ${checkpointSyncBlock}`);
            expect(scriptString).to.include(`--checkpoint-state ${checkpointSyncState}`);
            expect(scriptString).to.include(`--checkpoint-sync-url ${checkpointSyncUrl}`);
            // expect(scriptString).to.not.include('--genesis-backfill');
            // expect(scriptString).to.not.include('--genesis-state-url');
            // expect(scriptString).to.not.include('--genesis-state-url-timeout');
            // expect(scriptString).to.not.include('--reconstruct-historic-states');
            expect(scriptString).to.include(`--wss-checkpoint ${checkpointSyncWss}`);
            break;
          case 'lodestar':
            expect(scriptString).to.include(`--checkpointState ${checkpointSyncState}`);
            expect(scriptString).to.include(`--checkpointSyncUrl ${checkpointSyncUrl}`);
            expect(scriptString).to.include(`--forceCheckpointSync`);
            expect(scriptString).to.include(`--ignoreWeakSubjectivity`);
            expect(scriptString).to.include(`--wssCheckpoint ${checkpointSyncWss}`);
            break;
          case 'nimbus-eth2':
            //TODO: not sure about this one
            expect(scriptString).to.include(`--weak-subjectivity-checkpoint ${checkpointSyncWss}`);
            expect(scriptString).to.include(`--external-beacon-api-url ${checkpointSyncUrl}`);
            expect(scriptString).to.include(`--finalized-checkpoint-state ${checkpointSyncState}`);
            expect(scriptString).to.include(`--trusted-block-root ${checkpointSyncBlock}`);
            break;
          case 'prysm':
            expect(scriptString).to.include(`--checkpoint-block ${checkpointSyncBlock}`);
            expect(scriptString).to.include(`--checkpoint-state ${checkpointSyncState}`);
            expect(scriptString).to.include(`--checkpoint-sync-url ${checkpointSyncUrl}`);
            expect(scriptString).to.include(`--weak-subjectivity-checkpoint ${checkpointSyncWss}`);
            break;
          case 'teku':
            expect(scriptString).to.include(`--checkpoint-sync-url=${checkpointSyncUrl}`);
            expect(scriptString).to.include(`--ignore-weak-subjectivity-period-enabled`);
            expect(scriptString).to.include(`--ws-checkpoint=${checkpointSyncWss}`);
            break;
        }
      });

      it('should not include any checkpoint flags when checkpoint is disabled', () => {
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
            checkpointSync: {
              enabled: false,
              url: 'http://localhost:5052',
              block: '0x1234567890abcdef',
              state: 'genesis.ssz',
              ignoreWeakSubjectivityPeriod: true,
              force: true,
              wss: "block_root:epoch"
            }
          }
        } as DeepPartial<NodeConfig>);

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const checkpointSyncUrl = config.consensus?.checkpointSync?.url;
        const checkpointSyncState = config.consensus?.checkpointSync?.state;
        const checkpointSyncWss = config.consensus?.checkpointSync?.wss;
        const checkpointSyncBlock = config.consensus?.checkpointSync?.block;
        switch (client) {
          case 'lighthouse':
            // expect(scriptString).to.not.include('--checkpoint-blobs');
            expect(scriptString).to.not.include(`--checkpoint-block ${checkpointSyncBlock}`);
            expect(scriptString).to.not.include(`--checkpoint-state ${checkpointSyncState}`);
            expect(scriptString).to.not.include(`--checkpoint-sync-url ${checkpointSyncUrl}`);
            // expect(scriptString).to.not.include('--genesis-backfill');
            // expect(scriptString).to.not.include('--genesis-state-url');
            // expect(scriptString).to.not.include('--genesis-state-url-timeout');
            // expect(scriptString).to.not.include('--reconstruct-historic-states');
            expect(scriptString).to.not.include(`--wss-checkpoint ${checkpointSyncWss}`);
            break;
          case 'lodestar':
            expect(scriptString).to.not.include(`--checkpointState ${checkpointSyncState}`);
            expect(scriptString).to.not.include(`--checkpointSyncUrl ${checkpointSyncUrl}`);
            expect(scriptString).to.not.include(`--forceCheckpointSync`);
            expect(scriptString).to.not.include(`--ignoreWeakSubjectivity`);
            expect(scriptString).to.not.include(`--wssCheckpoint ${checkpointSyncWss}`);
            break;
          case 'nimbus-eth2':
            //TODO: not sure about this one
            expect(scriptString).to.not.include(`--weak-subjectivity-checkpoint ${checkpointSyncWss}`);
            expect(scriptString).to.not.include(`--external-beacon-api-url ${checkpointSyncUrl}`);
            expect(scriptString).to.not.include(`--finalized-checkpoint-state ${checkpointSyncState}`);
            expect(scriptString).to.not.include(`--trusted-block-root ${checkpointSyncBlock}`);
            break;
          case 'prysm':
            expect(scriptString).to.not.include(`--checkpoint-block ${checkpointSyncBlock}`);
            expect(scriptString).to.not.include(`--checkpoint-state ${checkpointSyncState}`);
            expect(scriptString).to.not.include(`--checkpoint-sync-url ${checkpointSyncUrl}`);
            expect(scriptString).to.not.include(`--weak-subjectivity-checkpoint ${checkpointSyncWss}`);
            break;
          case 'teku':
            expect(scriptString).to.not.include(`--checkpoint-sync-url=${checkpointSyncUrl}`);
            expect(scriptString).to.not.include(`--ignore-weak-subjectivity-period-enabled`);
            expect(scriptString).to.not.include(`--ws-checkpoint=${checkpointSyncWss}`);
            break;
        }
      });
    });
  });
}); 
import { expect } from 'chai';
import { CommandClientRegistry } from '@/command/command-client-registry';
import { ExecutionClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import { deepMerge } from '@test/fixtures/deepMerge.fixture';

describe('Execution Client Gas Price Oracle Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const executionClients: ExecutionClientName[] = [
    'besu',
    'erigon',
    'geth',
    'nethermind',
    'reth'
  ];

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  executionClients.forEach(client => {
    describe(`${client} GPO configuration`, () => {
      it('should not add GPO flags when GPO is disabled', () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            gpo: {
              enabled: false,
              blocks: 0,
              maxPrice: 0,
              ignorePrice: 0,
              percentile: 0
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.not.contain('--api-gas-price-blocks');
            expect(scriptString).to.not.contain('--api-gas-price-percentile');
            expect(scriptString).to.not.contain('--api-gas-price-max');
            break;
          case 'erigon':
            expect(scriptString).to.not.contain('--gpo.blocks');
            expect(scriptString).to.not.contain('--gpo.percentile');
            break;
          case 'geth':
            expect(scriptString).to.not.contain('--gpo.blocks');
            expect(scriptString).to.not.contain('--gpo.percentile');
            expect(scriptString).to.not.contain('--gpo.maxprice');
            expect(scriptString).to.not.contain('--gpo.ignoreprice');
            break;
          case 'nethermind':
            // I don't know if nethermind has a flag for this
            break;
          case 'reth':
            expect(scriptString).to.not.contain('--gpo.blocks');
            expect(scriptString).to.not.contain('--gpo.percentile');
            expect(scriptString).to.not.contain('--gpo.maxprice');
            expect(scriptString).to.not.contain('--gpo.ignoreprice');
            break;
        }
      });

      it('should add GPO blocks flag when enabled', () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            gpo: {
              enabled: true,
              blocks: 20
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--api-gas-price-blocks=20');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--gpo.blocks 20');
            break;
          case 'geth':
            expect(scriptString).to.contain('--gpo.blocks 20');
            break;
          case 'nethermind':
            // I don't know if nethermind has a flag for this
            break;
          case 'reth':
            expect(scriptString).to.contain('--gpo.blocks 20');
            break;
        }
      });

      it('should add GPO percentile flag when enabled', () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            gpo: {
              enabled: true,
              percentile: 60
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--api-gas-price-percentile=60');
            break;
          case 'erigon':
            expect(scriptString).to.contain('--gpo.percentile 60');
            break;
          case 'geth':
            expect(scriptString).to.contain('--gpo.percentile 60');
            break;
          case 'nethermind':
            // I don't know if nethermind has a flag for this
            break;
          case 'reth':
            expect(scriptString).to.contain('--gpo.percentile 60');
            break;
        }
      });

      it('should add GPO maxprice flag when enabled', () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            gpo: {
              enabled: true,
              maxPrice: 100
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            expect(scriptString).to.contain('--api-gas-price-max=100');
            break;
          case 'erigon':
            expect(scriptString).to.not.contain('--gpo.maxprice 100');
            break;
          case 'geth':
            expect(scriptString).to.contain('--gpo.maxprice 100');
            break;
          case 'nethermind':
            // I don't know if nethermind has a flag for this
            break;
          case 'reth':
            expect(scriptString).to.contain('--gpo.maxprice 100');
            break;
        }
      });

      it('should add GPO ignoreprice flag when enabled', () => {
        const config = deepMerge(testConfig, {
          execution: {
            client: {
              name: client,
              version: ''
            },
            gpo: {
              enabled: true,
              ignorePrice: 50
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();

        switch (client) {
          case 'besu':
            // TODO 
            // I don't know if besu has a flag for this
            break;
          case 'erigon':
            // TODO
            // erigon has no flag for this
            break;
          case 'geth':
            expect(scriptString).to.contain('--gpo.ignoreprice 50');
            break;
          case 'nethermind':
            // I don't know if nethermind has a flag for this
            break;
          case 'reth':
            expect(scriptString).to.contain('--gpo.ignoreprice 50');
            break;
        }
      });
    });
  });
}); 
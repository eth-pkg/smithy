import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ExecutionClientName } from '@/lib/types';
import { testConfig } from '../../preset-tests/network-preset.test-helper';
import SchemaUtils from '@/utils/schema';

describe('Execution Client Logging Configuration Tests', () => {
  let registry: CommandClientRegistry;
  const schemaUtils = new SchemaUtils('');
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
    it(`should correctly configure logging for ${client} when enabled`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          http: {
            enabled: false,
          },
          engine: {
            enabled: false,
          },
          client: {
            name: client,
            version: ''
          },
          logging: {
            enabled: true,
            stdout: {
              enabled: true,
              level: 'info',
              format: 'json',
              color: true
            },
            file: {
              enabled: true,
              level: 'info',
              format: 'json',
              directory: '/tmp/logs',
              name: `${client}-log.json`
            }
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();
      const logLevel = config.execution.logging.stdout.level;
      const stdoutLogFormat = config.execution.logging.stdout.format;
      const fileLogFormat = config.execution.logging.file.format;
      const logFile = `${config.execution.logging.file.directory}/${config.execution.logging.file.name}`;
      const directory = config.execution.logging.file.directory;
      const name = config.execution.logging.file.name;

      switch (client) {
        case 'besu':
          // TODO: add file logging through env variable
          expect(scriptString).to.contain(`--logging=${logLevel}`);
          expect(scriptString).to.contain(`--color-enabled`);
          expect(scriptString).to.contain(`--json-pretty-print-enabled`);
          break;
        case 'erigon':
          expect(scriptString).to.contain(`--log.console.json`);
          expect(scriptString).to.contain(`--log.console.verbosity ${logLevel}`);
          expect(scriptString).to.not.contain(`--log.dir.disable`);
          expect(scriptString).to.contain(`--log.dir.json`);
          expect(scriptString).to.contain(`--log.dir.path ${directory}`);
          expect(scriptString).to.contain(`--log.dir.verbosity ${logLevel}`);
          expect(scriptString).to.contain(`--log.json`);
          expect(scriptString).to.contain(`--verbosity ${logLevel}`);
          break;
        case 'geth':
          expect(scriptString).to.contain(`--log.file ${logFile}`);
          expect(scriptString).to.contain(`--log.format ${fileLogFormat}`);
          break;
        case 'nethermind':
          expect(scriptString).to.contain(`--Init.LogDirectory ${directory}`);
          expect(scriptString).to.contain(`--Init.LogFileName ${name}`);
          break;
        case 'reth':
          expect(scriptString).to.contain(`--log.file.directory ${directory}`);
          expect(scriptString).to.contain(`--log.file.filter ${logLevel}`);
          expect(scriptString).to.contain(`--log.file.format ${fileLogFormat}`);
          expect(scriptString).to.contain(`--log.stdout.filter ${logLevel}`);
          expect(scriptString).to.contain(`--log.stdout.format ${stdoutLogFormat}`);
          break;
        default:
          expect(false, "Unsupported client").to.be.true;
          break;
      }
    });

    it(`should not include any logging flags for ${client} when logging is disabled`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          http: {
            enabled: false,
          },
          engine: {
            enabled: false,
          },
          client: {
            name: client,
            version: ''
          },
          logging: {
            enabled: false,
            stdout: {
              enabled: true,
              level: 'info',
              format: 'json',
              color: true
            },
            file: {
              enabled: true,
              level: 'info',
              format: 'json',
              directory: '/tmp/logs',
              name: `${client}-log.json`
            }
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();

      switch (client) {
        case 'besu':
          expect(scriptString).to.not.contain(`--logging=`);
          expect(scriptString).to.not.contain(`--color-enabled`);
          expect(scriptString).to.not.contain(`--json-pretty-print-enabled`);
          break;
        case 'erigon':
          expect(scriptString).to.not.contain(`--log.console.json`);
          expect(scriptString).to.not.contain(`--log.console.verbosity`);
          expect(scriptString).to.not.contain(`--log.dir.json`);
          expect(scriptString).to.not.contain(`--log.dir.path`);
          expect(scriptString).to.not.contain(`--log.dir.verbosity`);
          expect(scriptString).to.not.contain(`--log.json`);
          expect(scriptString).to.not.contain(`--verbosity`);
          break;
        case 'geth':
          expect(scriptString).to.not.contain(`--log.file`);
          expect(scriptString).to.not.contain(`--log.format`);
          break;
        case 'nethermind':
          expect(scriptString).to.not.contain(`--Init.LogDirectory`);
          expect(scriptString).to.not.contain(`--Init.LogFileName`);
          break;
        case 'reth':
          expect(scriptString).to.not.contain(`--log.file.directory`);
          expect(scriptString).to.not.contain(`--log.file.filter`);
          expect(scriptString).to.not.contain(`--log.file.format`);
          expect(scriptString).to.not.contain(`--log.stdout.filter`);
          expect(scriptString).to.not.contain(`--log.stdout.format`);
          break;
        default:
          expect(false, "Unsupported client").to.be.true;
          break;
      }
    });

    it(`should not include stdout logging flags for ${client} when stdout logging is disabled`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          http: {
            enabled: false,
          },
          engine: {
            enabled: false,
          },
          client: {
            name: client,
            version: ''
          },
          logging: {
            enabled: true,
            stdout: {
              enabled: false,
              level: 'info',
              format: 'json',
              color: true
            },
            file: {
              enabled: true,
              level: 'info',
              format: 'json',
              directory: '/tmp/logs',
              name: `${client}-log.json`
            }
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();
      const directory = config.execution.logging.file.directory;
      const name = config.execution.logging.file.name;
      const logLevel = config.execution.logging.file.level;
      const fileLogFormat = config.execution.logging.file.format;
      const logFile = `${directory}/${name}`;

      switch (client) {
        case 'besu':
          // Assuming Besu doesn't have separate stdout flags
          expect(scriptString).to.not.contain(`--color-enabled`);
          break;
        case 'erigon':
          expect(scriptString).to.not.contain(`--log.console.json`);
          expect(scriptString).to.not.contain(`--log.console.verbosity`);
          // File logging should still be present
          expect(scriptString).to.contain(`--log.dir.json`);
          expect(scriptString).to.contain(`--log.dir.path ${directory}`);
          break;
        case 'geth':
          // Assuming Geth has no separate stdout flags in the original test
          // File logging should still be present
          expect(scriptString).to.contain(`--log.file ${logFile}`);
          break;
        case 'nethermind':
          // File logging should still be present
          expect(scriptString).to.contain(`--Init.LogDirectory ${directory}`);
          expect(scriptString).to.contain(`--Init.LogFileName ${name}`);
          break;
        case 'reth':
          // Stdout flags should be absent
          expect(scriptString).to.not.contain(`--log.stdout.filter`);
          expect(scriptString).to.not.contain(`--log.stdout.format`);
          // File logging should still be present
          expect(scriptString).to.contain(`--log.file.directory ${directory}`);
          expect(scriptString).to.contain(`--log.file.filter ${logLevel}`);
          expect(scriptString).to.contain(`--log.file.format ${fileLogFormat}`);
          break;
        default:
          expect(false, "Unsupported client").to.be.true;
          break;
      }
    });

    it(`should not include file logging flags for ${client} when file logging is disabled`, () => {
      const config = schemaUtils.deepMerge(testConfig, {
        execution: {
          http: {
            enabled: false,
          },
          engine: {
            enabled: false,
          },
          client: {
            name: client,
            version: ''
          },
          logging: {
            enabled: true,
            stdout: {
              enabled: true,
              level: 'info',
              format: 'json',
              color: true
            },
            file: {
              enabled: false,
              level: 'info',
              format: 'json',
              directory: '/tmp/logs',
              name: `${client}-log.json`
            }
          }
        }
      });

      const scriptContent = registry.getScriptContent(client, config);
      const scriptString = scriptContent.toString();
      const logLevel = config.execution.logging.stdout.level;
      const stdoutLogFormat = config.execution.logging.stdout.format;

      switch (client) {
        case 'besu':
          // Stdout logging should still be present
          expect(scriptString).to.contain(`--logging=${logLevel}`);
          expect(scriptString).to.contain(`--color-enabled`);
          break;
        case 'erigon':
          // Stdout logging should still be present
          expect(scriptString).to.contain(`--log.console.json`);
          expect(scriptString).to.contain(`--log.console.verbosity ${logLevel}`);
          // File logging should be absent
          expect(scriptString).to.not.contain(`--log.dir.json`);
          expect(scriptString).to.not.contain(`--log.dir.path`);
          expect(scriptString).to.not.contain(`--log.dir.verbosity`);
          break;
        case 'geth':
          // File logging should be absent
          expect(scriptString).to.not.contain(`--log.file`);
          break;
        case 'nethermind':
          // File logging should be absent
          expect(scriptString).to.not.contain(`--Init.LogDirectory`);
          expect(scriptString).to.not.contain(`--Init.LogFileName`);
          break;
        case 'reth':
          // Stdout logging should still be present
          expect(scriptString).to.contain(`--log.stdout.filter ${logLevel}`);
          expect(scriptString).to.contain(`--log.stdout.format ${stdoutLogFormat}`);
          // File logging should be absent
          expect(scriptString).to.not.contain(`--log.file.directory`);
          expect(scriptString).to.not.contain(`--log.file.filter`);
          expect(scriptString).to.not.contain(`--log.file.format`);
          break;
        default:
          expect(false, "Unsupported client").to.be.true;
          break;
      }
    });
  });
});
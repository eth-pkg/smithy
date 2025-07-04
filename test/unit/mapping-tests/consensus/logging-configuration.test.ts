import { expect } from 'chai';
import { CommandClientRegistry } from '@/command/command-client-registry';
import { ConsensusClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import { deepMerge } from '@test/fixtures/deepMerge.fixture';

describe('Consensus Client Logging Configuration Tests', () => {
  let registry: CommandClientRegistry;
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
    describe(`${client} logging configuration`, () => {
      it('should include any logging flags when logging is enabled', () => {
        const config = deepMerge(testConfig, {
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
              console: {
                enabled: true,
                level: 'info',
                format: 'json',
                color: true
              },
              file: {
                enabled: true,
                level: 'info',
                format: 'text',
                directory: 'logs',
                name: 'lighthouse.log',
                fullPath: '{consensus.logging.file.directory}/{consensus.logging.file.name}'
              }
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const logFileDirectory = config.consensus.logging.file.directory;
        const logFileName = config.consensus.logging.file.name;
        const logFileFullPath = `${logFileDirectory}/${logFileName}`;
        const logFileFormat = config.consensus.logging.file.format;
        const logLevel = config.consensus.logging.console.level;
        const fileLogLevel = config.consensus.logging.file.level;


        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.include(`--logfile ${logFileFullPath}`);
            expect(scriptString).to.include(`--logfile-format ${logFileFormat}`);
            expect(scriptString).to.include(`--debug-level ${logLevel}`);
            expect(scriptString).to.include(`--log-color`);
            expect(scriptString).to.include(`--logfile-debug-level ${fileLogLevel}`);
            break;

          case 'lodestar':
            // TODO: directory logging, not sure how should be approached 
            expect(scriptString).to.include(`--logFileLevel ${fileLogLevel}`);
            expect(scriptString).to.include(`--logLevel ${logLevel}`);
            expect(scriptString).to.include(`--logFile ${logFileFullPath}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.include(`--log-file ${logFileFullPath}`);
            expect(scriptString).to.include(`--log-level ${logLevel}`);
            // TODO: not sure if this means console logging
            // expect(scriptString).to.include(`--status-bar`);
            // expect(scriptString).to.include(`--status-bar-contents`);
            break;
          case 'prysm':
            // TODO: could not find logging for prysm
            break;
          case 'teku':
            expect(scriptString).to.include(`--logging=${logLevel}`);
            expect(scriptString).to.include(`--log-file=${logFileFullPath}`);
            expect(scriptString).to.include(`--log-color-enabled`);
            // TODO: need to merge two enabled flags 
            // expect(scriptString).to.include(`--log-destination=both`);
            break;
        }
      });

      it('should not include any logging flags when logging is disabled', () => {
        const config = deepMerge(testConfig, {
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
              enabled: false,
              console: {
                enabled: true,
                level: 'info',
                format: 'json',
                color: true
              },
              file: {
                enabled: true,
                level: 'info',
                format: 'text',
                directory: 'logs',
                name: 'lighthouse.log',
                fullPath: '{consensus.logging.file.directory}/{consensus.logging.file.name}'
              }
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config);
        const scriptString = scriptContent.toString();
        const logFileDirectory = config.consensus.logging.file.directory;
        const logFileName = config.consensus.logging.file.name;
        const logFileFullPath = `${logFileDirectory}/${logFileName}`;
        const logFileFormat = config.consensus.logging.file.format;
        const logLevel = config.consensus.logging.console.level;
        const fileLogLevel = config.consensus.logging.file.level;


        switch (client) {
          case 'lighthouse':
            expect(scriptString).not.to.include(`--logfile ${logFileFullPath}`);
            expect(scriptString).not.to.include(`--logfile-format ${logFileFormat}`);
            expect(scriptString).not.to.include(`--debug-level ${logLevel}`);
            expect(scriptString).not.to.include(`--log-color`);
            expect(scriptString).not.to.include(`--logfile-debug-level ${fileLogLevel}`);
            break;

          case 'lodestar':
            // TODO: directory logging, not sure how should be approached 
            expect(scriptString).not.to.include(`--logFileLevel ${fileLogLevel}`);
            expect(scriptString).not.to.include(`--logLevel ${logLevel}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).not.to.include(`--log-file ${logFileFullPath}`);
            expect(scriptString).not.to.include(`--log-level ${logLevel}`);
            break;
          case 'prysm':
            // TODO: could not find logging for prysm
            break;
          case 'teku':
            expect(scriptString).not.to.include(`--logging=${logLevel}`);
            expect(scriptString).not.to.include(`--log-file=${logFileFullPath}`);
            expect(scriptString).not.to.include(`--log-color-enabled`);
            break;
        }
      });
    });
  });
}); 
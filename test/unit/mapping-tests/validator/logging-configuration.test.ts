import { expect } from 'chai';
import { CommandClientRegistry } from '@/builders/command/command-client-registry';
import { ValidatorClientName } from '@/types';
import { testConfig } from '@test/fixtures/configs';
import SchemaUtils from '@/utils/schema';

describe('Validator Client Logging Configuration Tests', () => {
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
    describe(`${client} logging configuration`, () => {
      it('should correctly map file logging configuration', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: ''
            },
            enabled: true,
            logging: {
              enabled: true,
              file: {
                enabled: true,
                format: 'json',
                level: 'debug',
                path: '/var/log/validator.log'
              }
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const logFile = config.validator.logging.file.path;
        const logFileFormat = config.validator.logging.file.format;
        const logFileLevel = config.validator.logging.file.level;

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.include(`--logfile ${logFile}`);
            expect(scriptString).to.include(`--logfile-format ${logFileFormat}`);
            expect(scriptString).to.include(`--logfile-debug-level ${logFileLevel}`);
            break;
          case 'lodestar':
            expect(scriptString).to.include(`--logFile ${logFile}`);
            expect(scriptString).to.include(`--logFileLevel ${logFileLevel}`);
            break;
          case 'nimbus-eth2':
            expect(scriptString).to.include(`--log-file ${logFile}`);
            expect(scriptString).to.include(`--log-level ${logFileLevel}`);
            break;
          case 'prysm':
            expect(scriptString).to.include(`--log-file ${logFile}`);
            expect(scriptString).to.include(`--log-format ${logFileFormat}`);
            break;
          case 'teku':
            expect(scriptString).to.include(`--log-file=${logFile}`);
            // TODO: logging level are both for file and console, cannot test seperatel 
            // expect(scriptString).to.include(`--logging=${logFileLevel}`);
            expect(scriptString).to.include(`--log-destination=FILE`);
            break;
        }
      });

      it('should correctly map console logging configuration', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: ''
            },
            enabled: true,
            logging: {
              enabled: true,
              console: {
                enabled: true,
                color: true,
                format: 'json',
                level: 'debug'
              }
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const logFormat = config.validator.logging.console.format;
        const logLevel = config.validator.logging.console.level;

        switch (client) {
          case 'lighthouse':
            expect(scriptString).to.include(`--log-color`);
            expect(scriptString).to.include(`--log-format ${logFormat}`);
            expect(scriptString).to.include(`--debug-level ${logLevel}`);
            break;
          case 'lodestar':
            expect(scriptString).to.include(`--logLevel ${logLevel}`);
            break;
          case 'nimbus-eth2':
            // Nimbus console logging format not specified in docs
            break;
          case 'prysm':
            expect(scriptString).to.include(`--verbosity ${logLevel}`);
            break;
          case 'teku':
            expect(scriptString).to.include(`--log-color-enabled`);
            expect(scriptString).to.include(`--logging=${logLevel}`);
            expect(scriptString).to.include(`--log-destination=CONSOLE`);
            break;
        }
      });

      it('should not include logging flags when logging is disabled', () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: ''
            },
            enabled: false,
            logging: {
              enabled: true,
              file: {
                enabled: true,
                format: 'json',
                level: 'debug',
                path: '/var/log/validator.log'
              },
              console: {
                enabled: true,
                color: true,
                format: 'json',
                level: 'debug'
              }
            }
          }
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();

        // All clients should not include logging flags when logging is disabled
        expect(scriptString).to.not.include('--log');
        expect(scriptString).to.not.include('--debug');
        expect(scriptString).to.not.include('--verbosity');
      });
    });
  });
}); 
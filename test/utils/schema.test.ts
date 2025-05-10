import { expect } from 'chai';
import * as path from 'path';
import SchemaUtils from '../../src/utils/schema';

describe('SchemaUtils', () => {
  const presetsDir = path.join(__dirname, '../../data/presets');
  const schemaUtils = new SchemaUtils(presetsDir);

  describe('Defaults Extraction', () => {
    it('should extract defaults from schema and its references', () => {

      const defaults = schemaUtils.extractDefaults("default.yml");
      
      // Verify common defaults
      expect(defaults, 'Defaults object should exist').to.exist;
      expect(defaults, 'Defaults should be an object').to.be.an('object');
      expect(defaults.common, 'common object should exist').to.exist;
      expect(defaults.common, 'Missing common.dataDir property').to.haveOwnProperty('dataDir');
      expect(defaults.common, 'Missing common.engine property').to.haveOwnProperty('engine');
      expect(defaults.common, 'Missing common.network property').to.haveOwnProperty('network');
      expect(defaults.common, 'Missing common.operatingSystem property').to.haveOwnProperty('operatingSystem');

      // Verify execution defaults
      expect(defaults.execution, 'execution object should exist').to.exist;
      expect(defaults.execution.http, 'execution.http object should exist').to.exist;
      expect(defaults.execution.metrics, 'execution.metrics object should exist').to.exist;
      expect(defaults.execution.http, 'Missing execution.http.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.execution.http, 'Missing execution.http.modules property').to.haveOwnProperty('modules');
      expect(defaults.execution.http, 'Missing execution.http.address property').to.haveOwnProperty('address');
      expect(defaults.execution.http, 'Missing execution.http.port property').to.haveOwnProperty('port');
      expect(defaults.execution.metrics, 'Missing execution.metrics.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.execution.metrics, 'Missing execution.metrics.port property').to.haveOwnProperty('port');

      // Verify consensus defaults
      expect(defaults.consensus, 'consensus object should exist').to.exist;
      expect(defaults.consensus.http, 'consensus.http object should exist').to.exist;
      expect(defaults.consensus.metrics, 'consensus.metrics object should exist').to.exist;
      expect(defaults.consensus.http, 'Missing consensus.http.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.consensus.http, 'Missing consensus.http.port property').to.haveOwnProperty('port');
      expect(defaults.consensus.metrics, 'Missing consensus.metrics.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.consensus.metrics, 'Missing consensus.metrics.port property').to.haveOwnProperty('port');

      // Verify validator defaults
      expect(defaults.validator, 'validator object should exist').to.exist;
      expect(defaults.validator.metrics, 'validator.metrics object should exist').to.exist;
      expect(defaults.validator.externalSigner, 'validator.externalSigner object should exist').to.exist;
      expect(defaults.validator.proposerConfig, 'validator.proposerConfig object should exist').to.exist;
      expect(defaults.validator, 'Missing validator.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.validator.metrics, 'Missing validator.metrics.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.validator.externalSigner, 'Missing validator.externalSigner.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.validator.externalSigner, 'Missing validator.externalSigner.timeout property').to.haveOwnProperty('timeout');
      expect(defaults.validator.proposerConfig, 'Missing validator.proposerConfig.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.validator.proposerConfig, 'Missing validator.proposerConfig.maxValidators property').to.haveOwnProperty('maxValidators');
    });

    it('should have correct default values', () => {
      const defaults = schemaUtils.extractDefaults("default.yml");

      // Verify common default values
      expect(defaults.common.acceptTermsOfUse).to.equal(false, 'common.acceptTermsOfUse should default to false');
      expect(defaults.common.dataDir).to.equal('{HOME}/{common.network}', 'common.dataDir should have correct default value');
      expect(defaults.common.engine.enabled).to.equal(true, 'common.engine.enabled should default to true');
      expect(defaults.common.engine.communication.method).to.equal('jwt', 'common.engine.communication.method should default to jwt');
      expect(defaults.common.network.id).to.equal(1, 'common.network.id should default to 1');
      expect(defaults.common.network.name).to.equal('mainnet', 'common.network.name should default to mainnet');
      expect(defaults.common.operatingSystem).to.equal('linux', 'common.operatingSystem should default to linux');

      // Verify execution default values
      expect(defaults.execution.isExternal).to.equal(true, 'execution.isExternal should default to true');
      expect(defaults.execution.http.enabled).to.equal(false, 'execution.http.enabled should default to true');
      expect(defaults.execution.http.modules).to.deep.equal(['eth', 'net', 'web3'], 'execution.http.modules should have correct default values');
      expect(defaults.execution.http.address).to.equal('localhost', 'execution.http.address should default to localhost');
      expect(defaults.execution.http.port).to.equal(8545, 'execution.http.port should default to 8545');
      expect(defaults.execution.metrics.enabled).to.equal(false, 'execution.metrics.enabled should default to true');
      expect(defaults.execution.metrics.port).to.equal(6060, 'execution.metrics.port should default to 6060');

      // Verify consensus default values
      expect(defaults.consensus.http.enabled).to.equal(false, 'consensus.http.enabled should default to false');
      expect(defaults.consensus.http.port).to.equal(8545, 'consensus.http.port should default to 8545');
      expect(defaults.consensus.metrics.enabled).to.equal(false, 'consensus.metrics.enabled should default to false');
      expect(defaults.consensus.metrics.port).to.equal(8008, 'consensus.metrics.port should default to 8008');

      // Verify validator default values
      expect(defaults.validator.enabled).to.equal(false, 'validator.enabled should default to false');
      expect(defaults.validator.isExternal).to.equal(true, 'validator.isExternal should default to true');
      expect(defaults.validator.metrics.enabled).to.equal(false, 'validator.metrics.enabled should default to true');
      expect(defaults.validator.externalSigner.enabled).to.equal(false, 'validator.externalSigner.enabled should default to false');
      expect(defaults.validator.externalSigner.timeout).to.equal(5000, 'validator.externalSigner.timeout should default to 5000');
      expect(defaults.validator.proposerConfig.enabled).to.equal(false, 'validator.proposerConfig.enabled should default to false');
      expect(defaults.validator.proposerConfig.maxValidators).to.equal(1000000, 'validator.proposerConfig.maxValidators should default to 1000000');
    });
  });

  describe('Defaults Extraction for combined schema', () => {
    it('should extract defaults from schema and its references', () => {
      const defaults = schemaUtils.extractDefaults("combined/mainnet-non-staker.yml");
      
      
      // Verify common defaults
      expect(defaults, 'Defaults object should exist').to.exist;
      expect(defaults, 'Defaults should be an object').to.be.an('object');
      expect(defaults.common, 'common object should exist').to.exist;
      expect(defaults.common, 'Missing common.dataDir property').to.haveOwnProperty('dataDir');
      expect(defaults.common, 'Missing common.engine property').to.haveOwnProperty('engine');
      expect(defaults.common, 'Missing common.network property').to.haveOwnProperty('network');
      expect(defaults.common, 'Missing common.operatingSystem property').to.haveOwnProperty('operatingSystem');

      // Verify execution defaults
      expect(defaults.execution, 'execution object should exist').to.exist;
      expect(defaults.execution.http, 'execution.http object should exist').to.exist;
      expect(defaults.execution.metrics, 'execution.metrics object should exist').to.exist;
      expect(defaults.execution.http, 'Missing execution.http.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.execution.http, 'Missing execution.http.modules property').to.haveOwnProperty('modules');
      expect(defaults.execution.http, 'Missing execution.http.address property').to.haveOwnProperty('address');
      expect(defaults.execution.http, 'Missing execution.http.port property').to.haveOwnProperty('port');
      expect(defaults.execution.metrics, 'Missing execution.metrics.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.execution.metrics, 'Missing execution.metrics.port property').to.haveOwnProperty('port');

      // Verify consensus defaults
      expect(defaults.consensus, 'consensus object should exist').to.exist;
      expect(defaults.consensus.http, 'consensus.http object should exist').to.exist;
      expect(defaults.consensus.metrics, 'consensus.metrics object should exist').to.exist;
      expect(defaults.consensus.http, 'Missing consensus.http.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.consensus.http, 'Missing consensus.http.port property').to.haveOwnProperty('port');
      expect(defaults.consensus.metrics, 'Missing consensus.metrics.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.consensus.metrics, 'Missing consensus.metrics.port property').to.haveOwnProperty('port');

      // Verify validator defaults
      expect(defaults.validator, 'validator object should exist').to.exist;
      expect(defaults.validator.metrics, 'validator.metrics object should exist').to.exist;
      expect(defaults.validator.externalSigner, 'validator.externalSigner object should exist').to.exist;
      expect(defaults.validator.proposerConfig, 'validator.proposerConfig object should exist').to.exist;
      expect(defaults.validator, 'Missing validator.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.validator.metrics, 'Missing validator.metrics.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.validator.externalSigner, 'Missing validator.externalSigner.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.validator.externalSigner, 'Missing validator.externalSigner.timeout property').to.haveOwnProperty('timeout');
      expect(defaults.validator.proposerConfig, 'Missing validator.proposerConfig.enabled property').to.haveOwnProperty('enabled');
      expect(defaults.validator.proposerConfig, 'Missing validator.proposerConfig.maxValidators property').to.haveOwnProperty('maxValidators');
    });

    it('should have correct default values', () => {
      const defaults = schemaUtils.extractDefaults('combined/mainnet-non-staker.yml');

      // Verify common default values
      expect(defaults.common.acceptTermsOfUse).to.equal(false, 'common.acceptTermsOfUse should default to false');
      expect(defaults.common.dataDir).to.equal('{HOME}/{common.network}', 'common.dataDir should have correct default value');
      expect(defaults.common.engine.enabled).to.equal(true, 'common.engine.enabled should default to true');
      expect(defaults.common.engine.communication.method).to.equal('jwt', 'common.engine.communication.method should default to jwt');
      expect(defaults.common.network.id).to.equal(1, 'common.network.id should default to 1');
      expect(defaults.common.network.name).to.equal('mainnet', 'common.network.name should default to mainnet');
      expect(defaults.common.operatingSystem).to.equal('linux', 'common.operatingSystem should default to linux');

      // Verify execution default values
      expect(defaults.execution.isExternal).to.equal(true, 'execution.isExternal should default to true');
      expect(defaults.execution.http.enabled).to.equal(false, 'execution.http.enabled should default to true');
      expect(defaults.execution.http.modules).to.deep.equal(['eth', 'net', 'web3'], 'execution.http.modules should have correct default values');
      expect(defaults.execution.http.address).to.equal('localhost', 'execution.http.address should default to localhost');
      expect(defaults.execution.http.port).to.equal(8545, 'execution.http.port should default to 8545');
      expect(defaults.execution.metrics.enabled).to.equal(false, 'execution.metrics.enabled should default to true');
      expect(defaults.execution.metrics.port).to.equal(6060, 'execution.metrics.port should default to 6060');

      // Verify consensus default values
      expect(defaults.consensus.http.enabled).to.equal(false, 'consensus.http.enabled should default to false');
      expect(defaults.consensus.http.port).to.equal(8545, 'consensus.http.port should default to 8545');
      expect(defaults.consensus.metrics.enabled).to.equal(false, 'consensus.metrics.enabled should default to false');
      expect(defaults.consensus.metrics.port).to.equal(8008, 'consensus.metrics.port should default to 8008');

      // Verify validator default values
      expect(defaults.validator.enabled).to.equal(false, 'validator.enabled should default to false');
      expect(defaults.validator.isExternal).to.equal(true, 'validator.isExternal should default to true');
      expect(defaults.validator.metrics.enabled).to.equal(false, 'validator.metrics.enabled should default to true');
      expect(defaults.validator.externalSigner.enabled).to.equal(false, 'validator.externalSigner.enabled should default to false');
      expect(defaults.validator.externalSigner.timeout).to.equal(5000, 'validator.externalSigner.timeout should default to 5000');
      expect(defaults.validator.proposerConfig.enabled).to.equal(false, 'validator.proposerConfig.enabled should default to false');
      expect(defaults.validator.proposerConfig.maxValidators).to.equal(1000000, 'validator.proposerConfig.maxValidators should default to 1000000');
    });
  });
}); 
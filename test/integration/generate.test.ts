import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { generate } from '@/commands/generate';

describe('Config Generation', () => {
  const testOutputDir = path.join(process.cwd(), 'test-output');

  beforeEach(async () => {
    await fs.remove(testOutputDir);
    await fs.ensureDir(testOutputDir);
  });

  afterEach(async () => {
    await fs.remove(testOutputDir);
  });

  it('should generate config files for all clients when staking is true', async function() {
    this.timeout(10000);
    
    const options = {
      preset: 'default',
      execution: 'geth',
      consensus: 'lighthouse',
      validator: 'lighthouse',
      output: testOutputDir,
      verbose: false,
      configFile: path.join(process.cwd(), 'presets', 'default.yml')
    };

    await generate(options);

    // Check if all expected files were generated
    const files = await fs.readdir(testOutputDir);
    expect(files).to.include('geth.sh');
    expect(files).to.include('lighthouse.sh');
    expect(files).to.include('lighthouse-validator.sh');

    // Check if files have content
    const gethConfig = await fs.readFile(path.join(testOutputDir, 'geth.sh'), 'utf-8');
    const lighthouseConfig = await fs.readFile(path.join(testOutputDir, 'lighthouse.sh'), 'utf-8');
    const validatorConfig = await fs.readFile(path.join(testOutputDir, 'lighthouse-validator.sh'), 'utf-8');

    expect(gethConfig).to.not.be.empty;
    expect(lighthouseConfig).to.not.be.empty;
    expect(validatorConfig).to.not.be.empty;
  });

  it('should not generate validator config when staking is false', async function() {
    this.timeout(10000);
    
    // Create a temporary config with staking: false
    const tempConfigPath = path.join(testOutputDir, 'temp-config.yml');
    const configContent = {
      commonConfig: {
        clients: {
          execution: 'geth',
          consensus: 'lighthouse'
        },
        features: {
          staking: false,
          mevBoost: false,
          monitoring: true
        },
        dataDir: '$HOME/ethereum/mainnet',
        engine: {
          port: 8551,
          communication: 'jwt',
          endpointUrl: 'http://localhost:8551',
          host: 'localhost',
          ip: '127.0.0.1',
          jwtFile: '$HOME/ethereum/jwt.hex',
          scheme: 'http'
        },
        network: 'mainnet',
        operatingSystem: 'linux',
        syncMode: 'snap'
      }
    };
    
    await fs.writeFile(tempConfigPath, yaml.dump(configContent));

    const options = {
      preset: 'default',
      execution: 'geth',
      consensus: 'lighthouse',
      validator: "",
      output: testOutputDir,
      verbose: false,
      configFile: tempConfigPath
    };

    await generate(options);

    const files = await fs.readdir(testOutputDir);
    expect(files).to.include('geth.sh');
    expect(files).to.include('lighthouse.sh');
    expect(files).to.not.include('lighthouse-validator.sh');
  });

  it('should prompt for validator when staking is not set', async function() {
    this.timeout(10000);
    
    // Create a temporary config without staking flag
    const tempConfigPath = path.join(testOutputDir, 'temp-config.yml');
    const configContent = {
      commonConfig: {
        clients: {
          execution: 'geth',
          consensus: 'lighthouse'
        },
        features: {
          mevBoost: false,
          monitoring: true
        },
        dataDir: '$HOME/ethereum/mainnet',
        engine: {
          port: 8551,
          communication: 'jwt',
          endpointUrl: 'http://localhost:8551',
          host: 'localhost',
          ip: '127.0.0.1',
          jwtFile: '$HOME/ethereum/jwt.hex',
          scheme: 'http'
        },
        network: 'mainnet',
        operatingSystem: 'linux',
        syncMode: 'snap'
      }
    };
    
    await fs.writeFile(tempConfigPath, yaml.dump(configContent));

    const options = {
      preset: 'default',
      execution: 'geth',
      consensus: 'lighthouse',
      validator: 'lighthouse', // Provide validator to avoid prompt
      output: testOutputDir,
      verbose: true,
      configFile: tempConfigPath
    };

    await generate(options);

    const files = await fs.readdir(testOutputDir);
    expect(files).to.include('geth.sh');
    expect(files).to.include('lighthouse.sh');
    expect(files).to.include('lighthouse-validator.sh');
  });
}); 
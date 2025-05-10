import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
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

  it('should generate config files for all clients when staking is true', async function () {
    this.timeout(10000);

    const options = {
      preset: 'default',
      output: testOutputDir,
      verbose: false,
      configFile: path.join(process.cwd(), 'data', 'configs', 'staking-config.yml')
    };

    await generate(options);

    const files = await fs.readdir(testOutputDir);
    expect(files).to.include('geth.sh');
    expect(files).to.include('lighthouse.sh');
    expect(files).to.include('nimbus-eth2-validator.sh');

    const gethConfig = await fs.readFile(path.join(testOutputDir, 'geth.sh'), 'utf-8');
    const lighthouseConfig = await fs.readFile(path.join(testOutputDir, 'lighthouse.sh'), 'utf-8');
    const validator = await fs.readFile(path.join(testOutputDir, 'nimbus-eth2-validator.sh'), 'utf-8');

    expect(gethConfig).to.not.be.empty;
    expect(lighthouseConfig).to.not.be.empty;
    expect(validator).to.not.be.empty;
  });

  it('should not generate validator config when staking is false', async function () {
    this.timeout(10000);

    const options = {
      preset: 'default',
      output: testOutputDir,
      verbose: false,
      configFile: path.join(process.cwd(), 'data', 'configs', 'non-staking-config.yml')

    };

    await generate(options);

    const files = await fs.readdir(testOutputDir);
    expect(files).to.include('geth.sh');
    expect(files).to.include('lighthouse.sh');
    expect(files.length).to.equal(2);
  });

}); 
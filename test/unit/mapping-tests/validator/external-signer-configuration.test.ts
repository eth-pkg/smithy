import { expect } from "chai";
import { CommandClientRegistry } from "@/builders/command/command-client-registry";
import { ValidatorClientName } from "@/types";
import { testConfig } from '@test/fixtures/configs';
import SchemaUtils from "@/nodeconfig/schema";

describe("Validator Client External Signer Configuration Tests", () => {
  let registry: CommandClientRegistry;
  const schemaUtils = new SchemaUtils("");
  const validatorClients: ValidatorClientName[] = [
    "lighthouse",
    "lodestar",
    "nimbus-eth2",
    "prysm",
    "teku",
  ];

  beforeEach(() => {
    registry = new CommandClientRegistry();
  });

  validatorClients.forEach((client) => {
    describe(`${client} external signer configuration`, () => {
      it("should correctly map external signer configuration when enabled", () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: "",
            },
            enabled: true,
            externalSigner: {
              enabled: true,
              url: "http://localhost:9000",
              keystore: "/path/to/keystore",
              keystorePasswordFile: "/path/to/password.txt",
              publicKeys: ["0x123", "0x456"],
            },
          },
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const url = config.validator.externalSigner.url;
        const keystore = config.validator.externalSigner.keystore;
        const keystorePasswordFile =
          config.validator.externalSigner.keystorePasswordFile;
        const publicKeys = config.validator.externalSigner.publicKeys.join(",");

        switch (client) {
          case "lighthouse":
            // Lighthouse external signer configuration not specified in docs
            break;
          case "lodestar":
            expect(scriptString).to.include("--externalSigner.fetch");
            expect(scriptString).to.include(`--externalSigner.url ${url}`);
            expect(scriptString).to.include(
              `--externalSigner.pubkeys ${publicKeys}`
            );
            break;
          case "nimbus-eth2":
            expect(scriptString).to.include(`--web3-signer-url ${url}`);
            break;
          case "prysm":
            expect(scriptString).to.include(
              `--validators-external-signer-url ${url}`
            );
            expect(scriptString).to.include(
              `--validators-external-signer-key-file ${keystore}`
            );
            expect(scriptString).to.include(
              `--validators-external-signer-public-keys ${publicKeys}`
            );
            break;
          case "teku":
            expect(scriptString).to.include(
              `--validators-external-signer-url=${url}`
            );
            expect(scriptString).to.include(
              `--validators-external-signer-keystore=${keystore}`
            );
            expect(scriptString).to.include(
              `--validators-external-signer-keystore-password-file=${keystorePasswordFile}`
            );
            expect(scriptString).to.include(
              `--validators-external-signer-public-keys=${publicKeys}`
            );
            break;
        }
      });

      it("should correctly map external signer configuration when validator is disabled", () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: "",
            },
            enabled: false,
            externalSigner: {
              enabled: true,
              url: "http://localhost:9000",
              keystore: "/path/to/keystore",
              keystorePasswordFile: "/path/to/password.txt",
              publicKeys: ["0x123", "0x456"],
            },
          },
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const url = config.validator.externalSigner.url;
        const keystore = config.validator.externalSigner.keystore;
        const keystorePasswordFile =
          config.validator.externalSigner.keystorePasswordFile;
        const publicKeys = config.validator.externalSigner.publicKeys.join(",");

        switch (client) {
          case "lighthouse":
            // Lighthouse external signer configuration not specified in docs
            break;
          case "lodestar":
            expect(scriptString).to.not.include("--externalSigner.fetch");
            expect(scriptString).to.not.include(`--externalSigner.url ${url}`);
            expect(scriptString).to.not.include(
              `--externalSigner.pubkeys ${publicKeys}`
            );
            break;
          case "nimbus-eth2":
            expect(scriptString).to.not.include(`--web3-signer-url ${url}`);
            break;
          case "prysm":
            expect(scriptString).to.not.include(
              `--validators-external-signer-url ${url}`
            );
            expect(scriptString).to.not.include(
              `--validators-external-signer-key-file ${keystore}`
            );
            expect(scriptString).to.not.include(
              `--validators-external-signer-public-keys ${publicKeys}`
            );
            break;
          case "teku":
            expect(scriptString).to.not.include(
              `--validators-external-signer-url=${url}`
            );
            expect(scriptString).to.not.include(
              `--validators-external-signer-keystore=${keystore}`
            );
            expect(scriptString).to.not.include(
              `--validators-external-signer-keystore-password-file=${keystorePasswordFile}`
            );
            expect(scriptString).to.not.include(
              `--validators-external-signer-public-keys=${publicKeys}`
            );
            break;
        }
      });

      it("should correctly map external signer configuration when external signer is disabled", () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: "",
            },
            enabled: true,
            externalSigner: {
              enabled: false,
              url: "http://localhost:9000",
              keystore: "/path/to/keystore",
              keystorePasswordFile: "/path/to/password.txt",
              publicKeys: ["0x123", "0x456"],
            },
          },
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const url = config.validator.externalSigner.url;
        const keystore = config.validator.externalSigner.keystore;
        const keystorePasswordFile =
          config.validator.externalSigner.keystorePasswordFile;
        const publicKeys = config.validator.externalSigner.publicKeys.join(",");

        switch (client) {
          case "lighthouse":
            // Lighthouse external signer configuration not specified in docs
            break;
          case "lodestar":
            expect(scriptString).to.not.include("--externalSigner.fetch");
            expect(scriptString).to.not.include(`--externalSigner.url ${url}`);
            expect(scriptString).to.not.include(
              `--externalSigner.pubkeys ${publicKeys}`
            );
            break;
          case "nimbus-eth2":
            expect(scriptString).to.not.include(`--web3-signer-url ${url}`);
            break;
          case "prysm":
            expect(scriptString).to.not.include(
              `--validators-external-signer-url ${url}`
            );
            expect(scriptString).to.not.include(
              `--validators-external-signer-key-file ${keystore}`
            );
            expect(scriptString).to.not.include(
              `--validators-external-signer-public-keys ${publicKeys}`
            );
            break;
          case "teku":
            expect(scriptString).to.not.include(
              `--validators-external-signer-url=${url}`
            );
            expect(scriptString).to.not.include(
              `--validators-external-signer-keystore=${keystore}`
            );
            expect(scriptString).to.not.include(
              `--validators-external-signer-keystore-password-file=${keystorePasswordFile}`
            );
            expect(scriptString).to.not.include(
              `--validators-external-signer-public-keys=${publicKeys}`
            );
            break;
        }
      });
    });
  });
});

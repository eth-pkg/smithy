import { expect } from "chai";
import { CommandClientRegistry } from "@/builders/command/command-client-registry";
import { ValidatorClientName } from "@/types";
import { testConfig } from '@test/fixtures/configs';
import SchemaUtils from "@/utils/schema";

describe("Validator Client Graffiti Configuration Tests", () => {
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
    describe(`${client} graffiti configuration`, () => {
      it("should correctly map graffiti message when enabled", () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: "",
            },
            enabled: true,
            graffiti: {
              enabled: true,
              message: "test graffiti",
            },
          },
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const graffitiMessage = config.validator.graffiti.message;

        switch (client) {
          case "lighthouse":
            expect(scriptString).to.include(`--graffiti ${graffitiMessage}`);
            break;
          case "lodestar":
            expect(scriptString).to.include(`--graffiti ${graffitiMessage}`);
            break;
          case "nimbus-eth2":
            expect(scriptString).to.include(`--graffiti ${graffitiMessage}`);
            break;
          case "prysm":
            expect(scriptString).to.include(`--graffiti ${graffitiMessage}`);
            break;
          case "teku":
            expect(scriptString).to.include(
              `--validators-graffiti=${graffitiMessage}`
            );
            break;
        }
      });

      it("should correctly map graffiti file when enabled", () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: "",
            },
            enabled: true,
            graffiti: {
              enabled: true,
              file: "/path/to/graffiti.txt",
            },
          },
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const graffitiFile = config.validator.graffiti.file;
        switch (client) {
          case "lighthouse":
            expect(scriptString).to.include(`--graffiti-file ${graffitiFile}`);
            break;
          case "lodestar":
            // Lodestar doesn't support graffiti file
            break;
          case "nimbus-eth2":
            // Nimbus doesn't support graffiti file
            break;
          case "prysm":
            expect(scriptString).to.include(`--graffiti-file ${graffitiFile}`);
            break;
          case "teku":
            expect(scriptString).to.include(
              `--validators-graffiti-file=${graffitiFile}`
            );
            break;
        }
      });

      it("should not include graffiti flags when graffiti is disabled", () => {
        const config = schemaUtils.deepMerge(testConfig, {
          validator: {
            client: {
              name: client,
              version: "",
            },
            enabled: true,
            graffiti: {
              enabled: false,
              message: "test graffiti",
              file: "/path/to/graffiti.txt",
            },
          },
        });

        const scriptContent = registry.getScriptContent(client, config, true);
        const scriptString = scriptContent.toString();
        const graffitiMessage = config.validator.graffiti.message;
        const graffitiFile = config.validator.graffiti.file;
        switch (client) {
          case "lighthouse":
            expect(scriptString).to.not.include(`--graffiti ${graffitiMessage}`);

            expect(scriptString).to.not.include(
              `--graffiti-file ${graffitiFile}`
            );
            break;
          case "lodestar":
            expect(scriptString).to.not.include(`--graffiti ${graffitiMessage}`);

            // Lodestar doesn't support graffiti file
            break;
          case "nimbus-eth2":
            expect(scriptString).to.not.include(`--graffiti ${graffitiMessage}`);

            // Nimbus doesn't support graffiti file
            break;
          case "prysm":
            expect(scriptString).to.not.include(`--graffiti ${graffitiMessage}`);

            expect(scriptString).to.not.include(
              `--graffiti-file ${graffitiFile}`
            );
            break;
          case "teku":
            expect(scriptString).to.not.include(
              `--validators-graffiti-file=${graffitiFile}`
            );
            expect(scriptString).to.not.include(
              `--validators-graffiti=${graffitiMessage}`
            );

            break;
        }
      });
    });
  });
});

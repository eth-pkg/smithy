import { ConfigBuilder } from "@/commands/generate/config-builder";
import { ClientChoices, NodeConfig } from "@/types";

describe("ConfigBuilder", () => {
  let configBuilder: ConfigBuilder;

  beforeEach(() => {
    configBuilder = new ConfigBuilder();
  });

  describe("buildFinalConfig", () => {
    it("should build a valid configuration with all clients", () => {
      const userConfig: Partial<NodeConfig> = {
        common: {
          dataDir: "/test/data",
          engine: { 
            jwt: { file: "/test/jwt.hex", id: "test-id" }, 
            api: { 
              scheme: "http",
              host: "localhost",
              port: 8551,
              urls: ["http://localhost:8551"],
              ip: "127.0.0.1",
              allowlist: ["localhost"]
            } 
          },
          network: { name: "mainnet", id: 1 },
          operatingSystem: "linux"
        }
      };

      const options: ClientChoices = {
        preset: "default",
        execution: "geth",
        consensus: "lighthouse",
        validator: "lighthouse",
        output: "./test-output"
      };

      const result = configBuilder.buildFinalConfig(userConfig, options);

      expect(result.execution?.client.name).to.equal("geth");
      expect(result.consensus?.client.name).to.equal("lighthouse");
      expect(result.validator?.client.name).to.equal("lighthouse");
      expect(result.validator?.enabled).to.equal(true);
    });

    it("should build configuration without validator", () => {
      const userConfig: Partial<NodeConfig> = {};
      const options: ClientChoices = {
        preset: "default",
        execution: "nethermind",
        consensus: "prysm"
      };

      const result = configBuilder.buildFinalConfig(userConfig, options);

      expect(result.execution?.client.name).to.equal("nethermind");
      expect(result.consensus?.client.name).to.equal("prysm");
      expect(result.validator?.enabled).to.equal(false);
    });

    it("should preserve existing configuration values", () => {
      const userConfig: Partial<NodeConfig> = {
        execution: {
          client: { name: "", version: "1.0.0" },
          dataDir: "/existing/execution",
          isExternal: false
        } as any
      };

      const options: ClientChoices = {
        preset: "default",
        execution: "besu",
        consensus: "teku"
      };

      const result = configBuilder.buildFinalConfig(userConfig, options);

      expect(result.execution?.client.name).to.equal("besu");
      expect(result.execution?.client.version).to.equal("1.0.0");
      expect(result.execution?.dataDir).to.equal("/existing/execution");
    });
  });
}); 
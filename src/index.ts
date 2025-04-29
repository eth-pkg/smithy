export * from "./commands";
import { generate } from "./commands/generate";
import { listPresets } from "./commands/preset";
import { clients, getClientNames } from "./clients";

/**
 * Main library API for programmatic usage
 */
export default {
  /**
   * Generate Ethereum client configurations
   * @param options Generation options
   */
  generate,

  /**
   * List available configuration presets
   */
  listPresets,

  /**
   * Get all available client names by type
   */
  getClientNames,

  /**
   * All registered clients
   */
  clients,
};

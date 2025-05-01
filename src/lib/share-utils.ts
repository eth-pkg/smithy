/**
 * Utilities for sharing presets via URL
 */

/**
 * Encodes a preset object into a URL-safe string
 */
export function encodePreset(preset: any): string {
  try {
    // Convert the preset to a JSON string
    const presetJson = JSON.stringify(preset)

    // Encode the JSON string to base64
    const base64Encoded = btoa(presetJson)

    // Make the base64 string URL-safe by replacing characters
    const urlSafeEncoded = base64Encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

    return urlSafeEncoded
  } catch (error) {
    console.error("Error encoding preset:", error)
    throw new Error("Failed to encode preset")
  }
}

/**
 * Decodes a URL-safe string back into a preset object
 */
export function decodePreset(encoded: string): any {
  try {
    // Restore base64 standard characters
    let base64String = encoded.replace(/-/g, "+").replace(/_/g, "/")

    // Add padding if needed
    while (base64String.length % 4 !== 0) {
      base64String += "="
    }

    // Decode base64 to JSON string
    const jsonString = atob(base64String)

    // Parse JSON string to object
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("Error decoding preset:", error)
    throw new Error("Failed to decode preset")
  }
}


/**
 * Validates a preset object to ensure it has the required structure
 */
export function validatePresetStructure(preset: any): boolean {
  if (!preset) return false

  // Check for required top-level properties
  if (!preset.id || !preset.name || !preset.description || !preset.config) {
    return false
  }

  // Check for required config sections
  const { config } = preset
  if (!config.commonConfig) {
    return false
  }

  return true
}

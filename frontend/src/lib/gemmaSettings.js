export const defaultSettings = {
  gemmaApiUrl: 'https://generativelanguage.googleapis.com/v1beta',
  gemmaModel: 'gemma-4-31b-it',
  gemmaApiKey: '',
}

export function getStoredSettings() {
  return defaultSettings
}

export function persistSettings() {
  // Settings are intentionally not persisted in the browser.
}

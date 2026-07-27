export const SETTINGS_KEY = 'multimodal-track-gemma-settings'

export const defaultSettings = {
  gemmaApiUrl: 'https://api.deepinfra.com/v1/openai/chat/completions',
  gemmaModel: 'google/gemma-4-E4B-it',
  gemmaApiKey: '',
}

export function getStoredSettings() {
  try {
    return {
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'),
    }
  } catch {
    return defaultSettings
  }
}

export function persistSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

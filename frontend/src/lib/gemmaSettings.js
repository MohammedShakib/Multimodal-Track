export const SETTINGS_KEY = 'multimodal-track-gemma-settings'

export const defaultSettings = {
  gemmaApiUrl: 'https://generativelanguage.googleapis.com/v1beta',
  gemmaModel: 'gemini-flash-latest',
  gemmaApiKey: '',
}

export function getStoredSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')

    if (
      stored.gemmaApiUrl ===
        'https://api.deepinfra.com/v1/openai/chat/completions' &&
      stored.gemmaModel === 'google/gemma-4-E4B-it'
    ) {
      return {
        ...defaultSettings,
        gemmaApiKey: stored.gemmaApiKey ?? '',
      }
    }

    return {
      ...defaultSettings,
      ...stored,
    }
  } catch {
    return defaultSettings
  }
}

export function persistSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

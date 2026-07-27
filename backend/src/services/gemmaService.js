const PROMPT = `Analyze this messy whiteboard containing mixed Bangla and English text.

Return only one raw JSON object. Do not include markdown fences, reasoning, explanations, analysis steps, or text before or after the JSON.

The JSON must contain exactly these three keys:
{
  "markdown_summary": "A concise markdown summary with headings, bullets, and bold highlights where useful.",
  "code_snippets": [
    { "language": "javascript", "code": "..." }
  ],
  "flashcards": [
    { "question": "...", "answer": "..." }
  ]
}

If the image is too blurry, has no readable text, or cannot be understood, return:
{
  "markdown_summary": "",
  "code_snippets": [],
  "flashcards": []
}`;

function buildImageDataUrl(file) {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

function buildImageBase64(file) {
  return file.buffer.toString('base64');
}

function parseProviderError(details) {
  const fallback = details.trim();

  try {
    const payload = JSON.parse(details);
    const providerError = payload.error || payload;

    return (
      providerError.message ||
      providerError.status ||
      providerError.code ||
      fallback
    );
  } catch {
    return fallback;
  }
}

function extractJson(text) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const candidates = [];
    let depth = 0;
    let start = -1;
    let inString = false;
    let escaped = false;

    for (let index = 0; index < cleaned.length; index += 1) {
      const character = cleaned[index];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === '\\') {
        escaped = inString;
        continue;
      }

      if (character === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;

      if (character === '{') {
        if (depth === 0) start = index;
        depth += 1;
      }

      if (character === '}') {
        depth -= 1;
        if (depth === 0 && start !== -1) {
          candidates.push(cleaned.slice(start, index + 1));
          start = -1;
        }
      }
    }

    for (const candidate of candidates.reverse()) {
      try {
        return JSON.parse(candidate);
      } catch {
        // Try the next JSON-looking block.
      }
    }

    throw new Error('The AI response did not include valid JSON.');
  }
}

function normalizeAnalysis(payload) {
  const normalized = {
    markdown_summary:
      typeof payload.markdown_summary === 'string'
        ? payload.markdown_summary.trim()
        : '',
    code_snippets: Array.isArray(payload.code_snippets)
      ? payload.code_snippets
          .filter((snippet) => snippet && typeof snippet.code === 'string')
          .map((snippet) => ({
            language:
              typeof snippet.language === 'string' && snippet.language.trim()
                ? snippet.language.trim().toLowerCase()
                : 'text',
            code: snippet.code.trim(),
          }))
      : [],
    flashcards: Array.isArray(payload.flashcards)
      ? payload.flashcards
          .filter(
            (card) =>
              card &&
              typeof card.question === 'string' &&
              typeof card.answer === 'string',
          )
          .map((card) => ({
            question: card.question.trim(),
            answer: card.answer.trim(),
          }))
      : [],
  };

  const hasContent =
    normalized.markdown_summary ||
    normalized.code_snippets.length > 0 ||
    normalized.flashcards.length > 0;

  if (!hasContent) {
    const error = new Error(
      'The image is too blurry or no readable board text was found.',
    );
    error.statusCode = 422;
    throw error;
  }

  return normalized;
}

function getAssistantText(responseJson) {
  const content = responseJson?.choices?.[0]?.message?.content;

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : part.text ?? ''))
      .join('')
      .trim();
  }

  return typeof content === 'string' ? content.trim() : '';
}

function getGeminiText(responseJson) {
  return (
    responseJson?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim() ?? ''
  );
}

function isGoogleGeminiApi(apiUrl) {
  return apiUrl.includes('generativelanguage.googleapis.com');
}

function buildGoogleGenerateContentUrl(apiUrl, model) {
  const trimmedUrl = apiUrl.replace(/\/$/, '');

  if (trimmedUrl.includes(':generateContent')) {
    return trimmedUrl;
  }

  const normalizedModel = model.replace(/^models\//, '');

  if (trimmedUrl.endsWith('/models')) {
    return `${trimmedUrl}/${normalizedModel}:generateContent`;
  }

  return `${trimmedUrl}/models/${normalizedModel}:generateContent`;
}

async function analyzeWithGoogleGemini(file, { apiUrl, apiKey, model }) {
  const response = await fetch(buildGoogleGenerateContentUrl(apiUrl, model), {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: PROMPT },
            {
              inline_data: {
                mime_type: file.mimetype,
                data: buildImageBase64(file),
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        response_mime_type: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    const providerMessage = parseProviderError(details);
    const error = new Error(
      `Google Gemini API request failed (${response.status}). ${providerMessage.slice(0, 500)}`,
    );
    error.statusCode = response.status >= 500 ? 502 : response.status;
    error.code = 'GOOGLE_GEMINI_API_ERROR';
    throw error;
  }

  const responseJson = await response.json();
  const assistantText = getGeminiText(responseJson);

  if (!assistantText) {
    const error = new Error('The Google Gemini response was empty.');
    error.statusCode = 502;
    throw error;
  }

  return normalizeAnalysis(extractJson(assistantText));
}

async function analyzeWithOpenAiCompatibleGemma(file, { apiUrl, apiKey, model }) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: PROMPT },
            {
              type: 'image_url',
              image_url: { url: buildImageDataUrl(file) },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    const providerMessage = parseProviderError(details);
    const error = new Error(
      `Gemma API request failed (${response.status}). ${providerMessage.slice(0, 500)}`,
    );
    error.statusCode = response.status >= 500 ? 502 : response.status;
    error.code = 'GEMMA_API_ERROR';
    throw error;
  }

  const responseJson = await response.json();
  const assistantText = getAssistantText(responseJson);

  if (!assistantText) {
    const error = new Error('The AI response was empty.');
    error.statusCode = 502;
    throw error;
  }

  return normalizeAnalysis(extractJson(assistantText));
}

export async function analyzeWhiteboardImage(file, config = {}) {
  const apiUrl =
    config.apiUrl?.trim() ||
    process.env.GEMMA_API_URL ||
    'https://generativelanguage.googleapis.com/v1beta';
  const apiKey = config.apiKey?.trim() || process.env.GEMMA_API_KEY;
  const model = config.model?.trim() || process.env.GEMMA_MODEL || 'gemma-4-31b-it';

  if (!apiUrl || !apiKey || apiKey === 'replace-with-your-provider-token') {
    const error = new Error(
      'Gemma API is not configured. Add API settings in the app or set GEMMA_API_URL, GEMMA_API_KEY, and GEMMA_MODEL in backend/.env.',
    );
    error.statusCode = 503;
    throw error;
  }

  if (isGoogleGeminiApi(apiUrl)) {
    return analyzeWithGoogleGemini(file, { apiUrl, apiKey, model });
  }

  return analyzeWithOpenAiCompatibleGemma(file, { apiUrl, apiKey, model });
}

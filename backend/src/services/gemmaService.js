const PROMPT = `Analyze this messy whiteboard containing mixed Bangla and English text.

Output only valid JSON containing exactly these three keys:
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

function extractJson(text) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error('The AI response did not include valid JSON.');
    }

    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
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

export async function analyzeWhiteboardImage(file) {
  const apiUrl = process.env.GEMMA_API_URL;
  const apiKey = process.env.GEMMA_API_KEY;
  const model = process.env.GEMMA_MODEL || 'google/gemma-4-E4B-it';

  if (!apiUrl || !apiKey || apiKey === 'replace-with-your-provider-token') {
    const error = new Error(
      'Gemma API is not configured. Set GEMMA_API_URL, GEMMA_API_KEY, and GEMMA_MODEL in backend/.env.',
    );
    error.statusCode = 503;
    throw error;
  }

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
    const error = new Error(
      `Gemma API request failed (${response.status}). ${details.slice(0, 300)}`,
    );
    error.statusCode = response.status >= 500 ? 502 : 400;
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

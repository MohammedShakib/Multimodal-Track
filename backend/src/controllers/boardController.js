import { analyzeWhiteboardImage } from '../services/gemmaService.js';

export function getBoardConfig(_req, res) {
  const apiKey = process.env.GEMMA_API_KEY?.trim();
  const apiUrl =
    process.env.GEMMA_API_URL?.trim() ||
    'https://generativelanguage.googleapis.com/v1beta';
  const model = process.env.GEMMA_MODEL?.trim() || 'gemma-4-31b-it';

  res.json({
    configured: Boolean(apiKey && apiKey !== 'replace-with-your-provider-token'),
    apiUrl,
    model,
  });
}

export async function analyzeBoard(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('Please upload a whiteboard image.');
      error.statusCode = 400;
      throw error;
    }

    const result = await analyzeWhiteboardImage(req.file, {
      apiUrl: req.body.gemmaApiUrl,
      apiKey: req.body.gemmaApiKey,
      model: req.body.gemmaModel,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

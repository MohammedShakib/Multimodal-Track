import { analyzeWhiteboardImage } from '../services/gemmaService.js';

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

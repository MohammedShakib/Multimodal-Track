import { analyzeWhiteboardImage } from '../services/gemmaService.js';
import { getRequestUser } from './authController.js';
import {
  getDatabaseStatus,
  getRecentBoardAnalyses,
  saveBoardAnalysis,
} from '../services/databaseService.js';

export async function getBoardConfig(_req, res) {
  const apiKey = process.env.GEMMA_API_KEY?.trim();
  const apiUrl =
    process.env.GEMMA_API_URL?.trim() ||
    'https://generativelanguage.googleapis.com/v1beta';
  const model = process.env.GEMMA_MODEL?.trim() || 'gemma-4-31b-it';
  const database = await getDatabaseStatus();

  res.json({
    configured: Boolean(apiKey && apiKey !== 'replace-with-your-provider-token'),
    apiUrl,
    model,
    database,
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

    let saved = null;

    try {
      const sessionUser = await getRequestUser(req);

      saved = await saveBoardAnalysis({
        file: req.file,
        result,
        user: {
          name: sessionUser?.name || req.body.userName,
          email: sessionUser?.email || req.body.userEmail,
        },
      });
    } catch (saveError) {
      console.error(`Analysis persistence failed: ${saveError.message}`);
    }

    res.json({
      ...result,
      analysis_id: saved?.id ?? null,
      saved_at: saved?.created_at ?? null,
      saved: Boolean(saved),
    });
  } catch (error) {
    next(error);
  }
}

export async function listBoardAnalyses(req, res, next) {
  try {
    const analyses = await getRecentBoardAnalyses({
      userEmail: req.query.userEmail,
      limit: req.query.limit,
    });

    res.json({ analyses });
  } catch (error) {
    next(error);
  }
}

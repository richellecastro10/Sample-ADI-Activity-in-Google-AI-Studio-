/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

// POST /api/tutor/evaluate-argument
app.post('/api/tutor/evaluate-argument', async (req, res) => {
  const { claim, evidence, reasoning, guidingQuestion, loggedData } = req.body;
  if (!ai) {
    return res.json({ fallback: true, message: 'AI key not present; using offline intelligent rubric engine' });
  }
  try {
    const prompt = `You are an expert Grade 10 Chemistry educator and Argument-Driven Inquiry (ADI) tutor evaluating a student's scientific argument about Boyle's Law.
Guiding Question: ${guidingQuestion || "If temperature is held constant, what is the relationship between volume and pressure?"}

Student's Claim: "${claim}"
Student's Evidence: "${evidence}"
Student's Reasoning: "${reasoning}"
Logged Simulation Data: ${JSON.stringify(loggedData || [])}

Evaluate the student's argument based on standard ADI rubric:
1. Claim: Does it state that pressure and volume are inversely proportional at constant temperature?
2. Evidence: Does it cite numerical data points and show P * V = constant?
3. Reasoning: Does it invoke Kinetic Molecular Theory (particle collisions with walls, fixed molecular speed at 298 K, reduced space increasing collision frequency)?
Check for misconceptions (e.g. particles expanding/shrinking, or particles moving faster at constant temperature).

Respond with this exact JSON schema:
{
  "overallScore": 1,
  "levelLabel": "Developing",
  "claimScore": 1,
  "claimFeedback": "string",
  "evidenceScore": 1,
  "evidenceFeedback": "string",
  "reasoningScore": 1,
  "reasoningFeedback": "string",
  "detectedMisconceptions": [],
  "actionableTips": [],
  "praise": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, evaluation: parsed });
  } catch (err: any) {
    console.error('Gemini error:', err);
    return res.json({ fallback: true, error: err.message });
  }
});

// POST /api/tutor/chat
app.post('/api/tutor/chat', async (req, res) => {
  const { message, context } = req.body;
  if (!ai) {
    return res.json({ fallback: true });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are Dr. Curie, a warm, pedagogical Grade 10 Chemistry tutor guiding students through Lesson 1: Boyle's Law using the TI-MADI approach.
Context: ${JSON.stringify(context || {})}
Student asks: "${message}"

Give a supportive, concise (2-3 sentences), Socratic answer that guides their inquiry without giving away final test answers immediately. Connect to particle collisions or mathematical relationships.`,
    });
    return res.json({ reply: response.text });
  } catch (err: any) {
    return res.json({ fallback: true, error: err.message });
  }
});

// In dev, attach Vite middleware
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
  app.get('*', (_req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TI-MADI Chemistry ITS Server running on http://0.0.0.0:${PORT}`);
});

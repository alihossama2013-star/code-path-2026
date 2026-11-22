import { ApiRequest, ApiResponse, readJsonBody, sendJson } from './http.js';
import { generateTtsAudio } from './tts.js';

export async function handleTts(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(req, 64 * 1024);
  } catch {
    sendJson(res, 413, { error: 'PAYLOAD_TOO_LARGE' });
    return;
  }

  const rawText = typeof body.text === 'string' ? body.text : '';
  const lang = body.lang === 'en' ? 'en' : 'ar';

  const result = await generateTtsAudio(rawText, lang);
  if (!result.ok) {
    sendJson(res, result.status, { error: result.error, message: result.message });
    return;
  }

  sendJson(res, 200, {
    audioBase64: result.audioBase64,
    mimeType: result.mimeType,
  });
}

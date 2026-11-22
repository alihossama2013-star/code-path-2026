import { GoogleGenAI } from '@google/genai';

function createGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function generateTtsAudio(
  rawText: string,
  lang: 'en' | 'ar'
): Promise<{ ok: true; audioBase64: string; mimeType: string } | { ok: false; status: number; error: string; message: string }> {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { ok: false, status: 400, error: 'INVALID_INPUT', message: 'Text is required.' };
  }

  const ai = createGeminiClient();
  if (!ai) {
    return {
      ok: false,
      status: 503,
      error: 'TTS_NOT_CONFIGURED',
      message: 'Server-side GEMINI_API_KEY is not configured.',
    };
  }

  const cleanText = trimmed.slice(0, 3500);
  const style =
    lang === 'ar'
      ? 'Clear, warm, articulate Arabic computer science instructor explaining a web development lesson calmly to beginners'
      : 'Clear, warm, articulate computer science instructor explaining a web development lesson calmly to beginners';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Kore',
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return {
        ok: false,
        status: 502,
        error: 'EMPTY_AUDIO',
        message: 'No audio data was returned by the TTS service.',
      };
    }

    return {
      ok: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'TTS generation failed.';
    console.error('[/api/tts] Error generating speech:', message);
    return {
      ok: false,
      status: 502,
      error: 'TTS_GENERATION_FAILED',
      message,
    };
  }
}

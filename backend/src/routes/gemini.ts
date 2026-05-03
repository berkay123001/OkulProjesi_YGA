import { Router, Request, Response } from 'express';

export const geminiRouter = Router();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

geminiRouter.post('/chat', async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key bulunamadı. .env dosyasını kontrol et.' });
  }

  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message alanı boş olamaz.' });
  }

  const contents = [
    ...history,
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: {

          parts: [{ text: 'Sen bir haber doğrulama uzmanı asistanısın. Haberlerin doğruluğunu analiz et, kaynakları değerlendir ve dezenformasyonu tespit et. Türkçe konuş.' }]

        },
      }),
    });

    const data = await response.json() as {
      candidates?: { content: { parts: { text: string }[] } }[]
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Yanıt alınamadı.';
    return res.json({ text });

  } catch (err) {
    console.error('Hata:', err);
    return res.status(500).json({ error: 'Sunucu hatası.' });
  }
});
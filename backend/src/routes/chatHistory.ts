import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const chatHistoryRouter = Router();

const DATA_DIR = path.join(__dirname, '../../data');
const HISTORY_FILE = path.join(DATA_DIR, 'chat_history.json');

// data klasörü yoksa oluştur
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Dosya yoksa boş başlat
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify({ sessions: [], activeSessionId: '' }), 'utf-8');
}

function readHistory() {
  const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeHistory(data: object) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Tüm geçmişi getir
chatHistoryRouter.get('/', (_req: Request, res: Response) => {
  const data = readHistory();
  res.json(data);
});

// Oturum ekle veya güncelle
chatHistoryRouter.post('/sessions', (req: Request, res: Response) => {
  const session = req.body;
  if (!session?.id) return res.status(400).json({ error: 'id zorunlu.' });

  const data = readHistory();
  const index = data.sessions.findIndex((s: { id: string }) => s.id === session.id);

  if (index >= 0) {
    data.sessions[index] = session;
  } else {
    data.sessions.unshift(session);
  }

  writeHistory(data);
  return res.json({ success: true });
});

// Aktif oturumu güncelle
chatHistoryRouter.post('/active', (req: Request, res: Response) => {
  const { activeSessionId } = req.body;
  const data = readHistory();
  data.activeSessionId = activeSessionId;
  writeHistory(data);
  return res.json({ success: true });
});

// Oturum sil
chatHistoryRouter.delete('/sessions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = readHistory();
  data.sessions = data.sessions.filter((s: { id: string }) => s.id !== id);
  if (data.activeSessionId === id) {
    data.activeSessionId = data.sessions[0]?.id || '';
  }
  writeHistory(data);
  return res.json({ success: true });
});
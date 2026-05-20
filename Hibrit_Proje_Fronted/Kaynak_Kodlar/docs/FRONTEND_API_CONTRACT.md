# Frontend API Contract

Bu dokuman frontend tarafinin bekledigi OSINT Agent API sozlesmesini tanimlar. Backend ekibi bu sozlesmeye uyarsa frontend kodunda sadece `VITE_API_BASE_URL` degistirilerek gercek API'ye gecilebilir.

## Base URL

Varsayilan:

```text
http://localhost:3002/api/v1
```

Frontend env:

```env
VITE_API_BASE_URL=http://localhost:3002/api/v1
VITE_WEB_TOKEN=
```

`VITE_WEB_TOKEN` doluysa normal isteklerde `Authorization: Bearer <token>` header'i kullanilir. SSE icin token query param olarak `/events?token=<token>` seklinde eklenir.

## Error Format

Tum hatali HTTP yanitlari su formatta donmelidir:

```json
{
  "error": "Aciklayici hata mesaji",
  "statusCode": 400
}
```

## Endpoints

### GET /health

API, tool ve Neo4j durumunu gosterir.

Response:

```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": "2h 15m",
  "neo4j": "connected (142 nodes, 89 rels)",
  "sessionId": "session-123",
  "toolCount": 48
}
```

### POST /chat

Yeni analiz istegi baslatir. Islem asenkron ilerler; canli sonuc `/events` uzerinden gelir.

Request:

```json
{
  "message": "Sosyal medyada yayilan bu bagis kampanyasi gercek mi?"
}
```

Response:

```json
{
  "ok": true,
  "message": "Research started"
}
```

Devam eden islem varsa onerilen hata:

```json
{
  "error": "Research in progress",
  "statusCode": 409
}
```

### GET /events

Server-Sent Events stream. Her event su formatta gonderilir:

```text
data: {"type":"progress","msg":"Identity Agent: Searching..."}

```

Desteklenen eventler:

```json
{ "type": "init", "sessionId": "session-123", "processing": false, "messageCount": 0, "telemetry": { "calls": 0, "costUsd": 0 }, "replayEvents": [] }
```

```json
{ "type": "user_message", "content": "Investigate username: example", "ts": "14:32:05" }
```

```json
{ "type": "status", "processing": true }
```

```json
{ "type": "progress", "msg": "Identity Agent: Searching associated profiles.", "ts": "14:32:06" }
```

```json
{ "type": "detail", "toolName": "run_sherlock", "toolCallId": "call-123", "output": "Tool result text..." }
```

```json
{ "type": "telemetry", "msg": "[Tele] Identity Agent", "ts": "14:32:08", "summary": { "calls": 3, "costUsd": 0.05, "latencyMs": 3200 } }
```

```json
{ "type": "session_graph_dirty" }
```

```json
{ "type": "response", "content": "## Investigation Results\n\nFinal report..." }
```

```json
{ "type": "error", "message": "Tool failed" }
```

```json
{ "type": "reset", "sessionId": "new-session-456" }
```

### GET /status

Response:

```json
{
  "processing": false
}
```

### GET /history

Response:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Investigate username: example",
      "timestamp": "2026-05-20T12:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "## Investigation Results\n\nFinal report...",
      "timestamp": "2026-05-20T12:01:00.000Z",
      "kind": "analysis_response"
    },
    {
      "role": "assistant",
      "content": "## Investigation Report\n\nSaved report content...",
      "timestamp": "2026-05-20T12:02:00.000Z",
      "kind": "report"
    }
  ]
}
```

Frontend normal `assistant` cevaplarini chat cevabi olarak gosterir. Rapor kartlari sadece `role: "assistant"` ve `kind: "report"` olan kayitlardan turetilir. `kind: "analysis_response"` kayitlari rapor listesine otomatik eklenmez.

Mevcut API dosyasinda ayri bir report endpoint olmadigi icin MVP davranisi sudur: kullanici frontendde **Rapor Olustur** butonuna bastiginda son `analysis_response` icerigi rapor kaydi olarak kullanilir. Backend kalici rapor saklayacaksa ayni icerigi `/history` icinde `kind: "report"` olarak dondurmelidir.

### GET /graph/session

Response:

```json
{
  "nodes": [
    { "id": "claim-main", "label": "Claim", "caption": "Ana iddia" },
    { "id": "source-1", "label": "Source", "caption": "Kaynak A" }
  ],
  "edges": [
    { "from": "source-1", "to": "claim-main", "label": "SUPPORTS", "caption": "confidence: 0.82" }
  ]
}
```

Graph bos olabilir:

```json
{
  "nodes": [],
  "edges": []
}
```

### GET /graph/stats

Response:

```json
{
  "nodes": 142,
  "relationships": 89
}
```

## Local Mock API

Frontend ekibi backend hazir olmadan bu kontrati su komutla test eder:

```powershell
npm.cmd run mock:api
```

Sonra frontend:

```powershell
npm.cmd run dev
```

Mock API sadece demo ve frontend gelistirme amaclidir. Gercek backend hazir oldugunda mock API kapatilir ve `VITE_API_BASE_URL` gercek API adresine cevrilir.

# 📋 Task Tracker

> Her hafta görev tanımları ve durumları burada güncellenecektir.
> Görev yapmayan üyelerin durumları ❌ olarak işaretlenir.

---

## 📌 Hafta 1 (24.03.2026 – 30.03.2026) — Proje Tanımı & Planlama

> Hafta 1'de proje konusu belirlendi, ekip rolleri dağıtıldı ve genel planlama yapıldı.

---

## 📌 Hafta 2 (30.03.2026 – 04.04.2026) — Hafta 1'in Devamı

### Dilan Çiçek (240541044) — Frontend & UI/UX Tasarımı

**Görev 1: Arayüz Prototip Araştırması**
- **Açıklama:** Stitch, Google AI Studio, Blitz AI, Emergent AI gibi no-code prototipleme araçlarını araştırarak arayüz prototipleri oluştur. Özellikle Google AI Studio ve Stitch ile başlanması tavsiye edilir. Net bir karar verilmesine gerek yok; örnekler çıkarılmalı, grup olarak seçim yapılacak.
- **Teslim:** Görsel arayüz prototipleri (ekran görüntüleri/dosyalar)
- **Tarih:** 03.04.2026 (Cuma)
- **Durum:** ❌ Yapılmadı

**Görev 2: Frontend Teknoloji Araştırması**
- **Açıklama:** Frontend için kullanılabilecek dilleri/çerçeveleri araştır. Her seçeneğin avantaj ve dezavantajlarını belgele. Seçim yapılmasa bile seçenekler net bir şekilde listelenmeli.
- **Teslim:** Frontend teknoloji karşılaştırma dokümanı
- **Tarih:** 04.04.2026 (Cumartesi)
- **Durum:** ❌ Yapılmadı

---

### Ali Türk (240542016) & Hasan Zekeriya Şimşek (240542020) — Ortak Görev

**Görev 1: Literatür Araştırmasının Derinleştirilmesi**
- **Açıklama:** OSINT, yalan haber doğrulama (text-based) ve deepfake haber doğrulama alanlarında literatür taraması yap. Aşağıdaki sorulara cevap aranmalı:
  - Literatürde mevcut benchmarklar ve veri raporları nelerdir?
  - Bu projelerin bizim projemizden farkı nedir?
  - Mevcut projeler hangi sınıflandırma kriterlerini kullanıyor?
  - Hangi model yaklaşımını kullanmışlar? (LLM, Classification model, vb.)
  - Literatürdeki benchmarklar yeterli mi, eksiklikler neler?
  - Bizim projemizin farkı/özgünlüğü ne olacak?
- **Not:** Benchmark ve veri kalitesi kısmı Hasan'ı doğrudan ilgilendirdiği için Hasan da Ali'ye destek veriyor.
- **Teslim:** Literatür raporu + makale linkleri + karşılaştırma tablosu
- **Tarih:** 03.04.2026 (Cuma)
- **Durum:** ✅ Kısmen Tamamlandı

> **📝 Not:** Ali literatür taramasını teslim etti (bkz. `docs/hafta2/Literatür Taraması.md`). Eksikler: Karşılaştırma tablosu, benchmark yeterlilik analizi. Hasan: ❌ Yapılmadı. Takım çalışması beklenen seviyede gerçekleştirilememiştir.

---

### ⚠️ Hatırlatmalar

- Sonuçlar GitHub reposuna push edilecek, ilgili klasörler altında.

---

## 📌 Hafta 3 (04.04.2026 – 11.04.2026)

### Dilan Çiçek (240541044) & Hasan Zekeriya Şimşek (240542020) — Ortak Görev

**Görev 1: Sohbet Arayüzü Geliştirme (UI + Backend)**
- **Açıklama:** Hafta 2'de seçilen UI konsept tasarımı üzerinden sohbet ekranı geliştirilecek. Sohbet arayüzünde şu bileşenler aktif hale getirilecek:
  - Sohbet geçmişi (kaldığı yerden devam edilebilme)
  - Ayarlar ekranı
  - Kullanıcının etkileşim kurabileceği tüm arayüz elemanları
  - **Not:** Genel UI değil, sadece sohbet arayüzü odaklı.
- **Teslim:** Çalışan sohbet arayüzü prototipi
- **Tarih:** 11.04.2026 (Cuma)
- **Durum:** ⏳ Beklemede

**Hasan'ın Alt Görevi: Model Bağlama & Sohbet Hafızası**
- **Açıklama:** Google AI Studio'dan ücretsiz Gemini API key alınarak sohbet ekranına model bağlanacak. Gereksinimler:
  - Sohbet geçmişinde kaldığı yerden devam edilebilmeli
  - Hafıza bozulmamalı
  - Devam eden sohbette model context/bağlam kaybedilmemeli
  - Firebase entegrasyonu gerekmez — SQLite veya JSON kullanılabilir
  - Veritabanı bağlantıları sonraki haftalarda ayrı görev olarak verilecek
- **Teslim:** Gemini API entegre çalışan sohbet modülü
- **Tarih:** 11.04.2026 (Cuma)
- **Durum:** ⏳ Beklemede

---

### Ali Türk (240542016) — Teknik Raporlama & Araştırma

**Görev 1: GitHub Proje Araştırması**
- **Açıklama:** Literatürde bulunan makalelere karşılık gelen GitHub projelerini araştır. Öncelikli kontrol:
  1. Önce önceki haftalarda bulunan makalelerin GitHub kodları var mı kontrol et
  2. Her GitHub projesi makaleleştirilmemiş olabilir, bu yüzden doğrudan GitHub'da da araştırma yap
  3. Bizim projemize benzer çalışmalar (tamamen aynı olmasa da) tespit et
  4. Agent yönetimi için kullanılan teknolojileri belgele (LangGraph, AutoGen, CrewAI, vb.)
  5. İncelenen projelerden ilham alınabilecek/kullanılabilecek teknolojileri belgele (örn: web scraping için X kullanmışlar bizde kullanılabilir, prompt ayarları için Y yaklaşımı var vb.)
- **Teslim:** GitHub proje raporu + linkler + kullanılabilir teknoloji önerileri
- **Tarih:** 11.04.2026 (Cuma)
- **Durum:** ⏳ Beklemede

---

### ⚠️ Hatırlatmalar

- Sonuçlar GitHub reposuna push edilecek, ilgili klasörler altında.

---

## 📌 Durum Simgeleri

| Simge | Anlam |
|---|---|
| ⏳ Beklemede | Henüz başlanmadı |
| 🔄 Sürüyor | Üzerinde çalışılıyor |
| ✅ Tamamlandı | Görev teslim edildi |
| ❌ Yapılmadı | Süresi dolmuş, teslim edilmemiş |

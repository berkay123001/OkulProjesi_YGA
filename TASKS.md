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
- **Durum:** ⚠️ Geç Tamamlandı / Revize Bekleniyor

> **📝 Not:** PR #12 ile teslim edildi. Teslim tarihi aşıldığı için geç tamamlandı sayıldı. PR #13 üzerinden revize istenmiştir.

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

## 📌 Hafta 4 (11.04.2026 – 18.04.2026) — Sınav Haftası

> Sınav haftası nedeniyle yeni görev verilmemiştir.

---

## 📌 Hafta 5 (18.04.2026 – 25.04.2026)

> **Rol Değişiklikleri:** Hasan → UI/Tasarım, Ali → Backend, Dilan → Hasan'a Destek

### Hasan Zekeriya Şimşek — UI/Tasarım

**Görev 1 (Gecikmiş — Eski Hafta Görevi): PR #13 Düzeltmeleri**
- **Açıklama:** PR #13'teki düzeltmeleri Dilan ile birlikte tamamla. API key güvenliği, AI Studio yorumu, import path'ler, OSINT katmanı içeriği, hardcoded kullanıcı adı.
- **Tarih:** Pazar 27.04.2026 23:59 (son uzatma)
- **Durum:** ⏳ Beklemede

**Görev 2: Frontend Tasarımını Makaleye Uygun Güncelle**
- **Açıklama:** Drive'daki taslak makale PDF'ini referans alarak frontend tasarımını güncelle. Özellikle:
  - OSINT katmanı: Kripto tablosu yerine makaledeki araç envanteri (Tablo II), 4 katmanlı arama zinciri ve güven skorları (verified/high/medium/low) gösterilmeli
  - Agent sohbet: Küçük yan panel yerine ayrı tam sayfa — Supervisor → Alt-ajan görev devri, Planla-İncele-Sentezle boru hattı adımları timeline olarak gösterilmeli
  - Neo4j graf görselleştirmesi için bir panel/sekme (makalede D3.js tabanlı)
- **Tarih:** Cuma 01.05.2026 23:59
- **Durum:** ⏳ Beklemede

**Görev 3: Sidebar Navigasyonu ve Sistem Mimarisi (Dilan ile Ortak)**
- **Açıklama:** Dilan ile birlikte analiz edip tamamlayın — Makaledeki sistem mimarisine (Figure 1) uygun sidebar navigasyonu: Kimlik, Medya, Akademik alt-ajan görünümleri + Graf paneli + Telemetri paneli.
- **Tarih:** Cuma 01.05.2026 23:59
- **Durum:** ⏳ Beklemede

**⚠️ Takım Çalışması Şartı:** Ali Türk ve Dilan Çiçek ile aktif iletişim ve iş birliği bekleniyor. GitHub commit geçmişi ve PR yorumları üzerinden takım çalışması kanıtı zorunludur. İletişim ve takım çalışması yoksa görevler geçersiz sayılacaktır.

---

### Ali Türk — Backend

**Görev 1: Backend Proxy Kurulumu**
- **Açıklama:** TypeScript tabanlı basit bir backend proxy kur (Express veya benzeri). Gemini API key backend'de kalsın, frontend bu endpoint'e istek atsın. Projenin mevcut kodu çoğunlukla TypeScript tabanlı, bu yüzden Python yerine TS kullanılması gerekiyor — gereksiz komplekslik yaratmamak adına.
- **Teslim:** Çalışan backend proxy + endpoint dokümantasyonu
- **Tarih:** Çarşamba 29.04.2026 23:59
- **Durum:** ⏳ Beklemede

**Görev 2: JSON Tabanlı Sohbet Geçmişi Endpoint'i**
- **Açıklama:** Sohbet geçmişi için JSON tabanlı okuma/yazma endpoint'i yaz. Yeni mesaj JSON'a kaydedilsin, sayfa yenilendiğinde geri yüklensin.
- **Teslim:** Çalışan JSON okuma/yazma modülü
- **Tarih:** Çarşamba 29.04.2026 23:59
- **Durum:** ⏳ Beklemede

**⚠️ Neden erken:** Backend proxy hazır olmadan Hasan ve Dilan frontend entegrasyonunu yapamaz. Senin backend'in hazır olması onların çalışmasını doğrudan etkiliyor. Bu yüzden çarşamba teslim edilmesi zorunlu — yoksa Hasan ve Dilan'ın süresi de uzar, proje aksar.

**⚠️ Takım Çalışması Şartı:** Hasan ile aktif iletişim ve iş birliği bekleniyor (backend-frontend entegrasyonu). Hasan ve Dilan backend konusunda deneyimli değil, entegrasyonu senin yönlendirmenle yapmak zorundalar. İletişim ve takım çalışması yoksa görevler geçersiz sayılacaktır.

---

### Dilan Çiçek — Hasan'a Destek

**Görev 1 (Gecikmiş — Eski Hafta Görevi): PR #13 Düzeltmeleri**
- **Açıklama:** PR #13'teki düzeltmeleri Hasan ile birlikte tamamla.
- **Tarih:** Pazar 27.04.2026 23:59 (son uzatma)
- **Durum:** ⏳ Beklemede

**Görev 2: Hasan'a Frontend Destek**
- **Açıklama:** Hasan'a frontend tasarımında destek ol — özellikle hardcoded kullanıcı adı düzeltmesi ve görsel düzenlemeler.
- **Tarih:** Cuma 01.05.2026 23:59
- **Durum:** ⏳ Beklemede

**Görev 3: Sidebar Navigasyonu ve Sistem Mimarisi (Hasan ile Ortak)**
- **Açıklama:** Hasan ile birlikte analiz edip tamamlayın — sidebar navigasyonu ve sistem mimarisine uygun arayüz tasarımı.
- **Tarih:** Cuma 01.05.2026 23:59
- **Durum:** ⏳ Beklemede

**⚠️ Takım Çalışması Şartı:** Hasan ile aktif iletişim ve iş birliği bekleniyor. İletişim ve takım çalışması yoksa görevler geçersiz sayılacaktır.

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

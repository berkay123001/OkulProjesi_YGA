# Hibrit Doğrulama Sistemi - Dezenformasyon & Siber Dolandırıcılık Tespiti

## Literatür Taraması

---

## Literatürdeki Mevcut Projeler ve Kullandıkları Sınıflandırma Kriterleri

### Yalan Haber ve Bağlam Doğrulama

| Proje | Yöntem | Sınıflandırma Kriteri | Odak Alanı |
|---|---|---|---|
| **LIAR Veri Seti** | NLP / LLM | 6 seviye doğruluk (Tamamen Doğru → Uydurma) | Siyasi demeçlerin ve metinlerin fact-checking'i; gri alanların tespiti |
| **FakeNewsNet** | Grafik Sinir Ağları (GNN) | Yayılma hızı + kullanıcı ağı topolojisi | Sahte haberlerin sosyal medyadaki yayılma rotası ve kullanıcı grupları analizi |
| **NewsCLIPp** | OpenAI CLIP mimarisi | Metin-görsel bağlamsal uyumsuzluk | Haber metni ile kullanılan görselin tutarlılık kontrolü |

### OSINT (Açık Kaynak İstihbaratı) ve Dijital Ayak İzi

| Proje | Yöntem | Odak Alanı |
|---|---|---|
| **SpiderFoot** | 100+ API otomatik taraması (Shodan, Pastebin, sosyal medya) | IP, alan adı, e-posta dijital ayak izi çıkarımı; haber kaynağının arkasındaki şüpheli bağlantıların tespiti |

### Deepfake ve Görsel Manipülasyon Doğrulama

| Proje | Yöntem | Sınıflandırma Kriteri | Odak Alanı |
|---|---|---|---|
| **ManTra-Net** | Derin öğrenme (heatmap analizi) | Piksel seviyesi anomali tespiti | Photoshop manipülasyonlarının tespiti; ısı haritası görselleştirme |
| **DIRE** | Difüzyon modeli yeniden yapılandırma | Reconstruction Error (düşük hata = AI, yüksek hata = gerçek) | DALL-E, Midjourney gibi difüzyon modelleriyle üretilen sentetik görsellerin tespiti |

---

## Mevcut Sistemlerin Eksiklikleri

- **Kopuk Yapılar:** Metni analiz eden sistem görselden anlamıyor; görseli inceleyen sistem kaynağın geçmişini (OSINT) sorgulamıyor. Araçlar birbirleriyle bilgi alışverişi yapamıyor.
- **Yöntem Bağımlılığı:** Bir görseli incelemek için Photoshop müdahalesi mi yoksa AI üretimi mi olduğunu önceden tahmin etmek gerekiyor. Modern ve hibrit saldırılar karşısında ciddi zaman kaybı ve zafiyet yaratıyor.
- **Bütüncül Bir Kontrol Hattı Yok:** Kaynaktan başlayıp görselin DNA'sına ve metnin mantığına kadar uzanan uçtan uca bir "doğrulama koridoru" mevcut değil.

---

## Projemizin Özgün Değeri

Bizim projemiz, literatürdeki bu "ayrık adaları" birleştiren bir köprü inşa ediyor. Farkımızı şu üç noktada topluyoruz:

1. **Çapraz Doğrulama Mimarisi:** Sadece "bu haber yalan" demiyoruz. Haberi; kaynağının güvenilirliği (OSINT), görselinin teknik gerçekliği (Visual Forensics) ve metnin bağlamsal tutarlılığı açısından aynı anda sorgulayan hibrit bir sistem sunuyoruz.

2. **Karma Tehditlere Hibrit Savunma:** Güncel bir dezenformasyon operasyonu; şüpheli bir kaynak, manipüle edilmiş bir görsel ve kurgulanmış bir metinle gelir. Sistemimiz bu saldırının her bir katmanını ayrı ayrı ama birbiriyle eşgüdümlü olarak analiz eder.

3. **Merkezi Karar Destek Mekanizması:** Kullanıcıyı farklı araçlar arasında mekik dokumaktan kurtarıyoruz. Tek bir platform üzerinden, karmaşık verileri anlaşılır bir sonuca dönüştürerek hızlı karar almayı sağlıyoruz.

---

## Kaynaklar

| Kaynak | Bağlantı |
|---|---|
| LIAR Veri Seti | https://arxiv.org/abs/1705.00648 |
| FakeNewsNet | https://arxiv.org/abs/1809.01286 |
| NewsCLIPp | https://arxiv.org/abs/2106.09637 |
| SpiderFoot | https://github.com/smicallef/spiderfoot |
| ManTra-Net | https://arxiv.org/abs/1912.11434 |
| DIRE | https://arxiv.org/abs/2303.09295 |

# GitHub Proje Araştırma Raporu ve Kullanılabilir Teknolojiler

Bu rapor, dezenformasyon ve OSINT tabanlı analiz projemiz için literatürdeki çalışmaların kod karşılıklarını, benzer projeleri ve kullanılacak ajan (agent) teknolojilerini kapsamaktadır.

---

## Literatürdeki Makalelerin GitHub Karşılıkları

Önceki haftalarda incelenen temel makalelerin açık kaynak kod depoları (repository) doğrulanmıştır:

- **Liar Veri Seti:** [github.com/cswang/Liar-Plus](https://github.com/cswang/Liar-Plus)
  - *Not:* Makaledeki 6 dereceli sınıflandırma mimarisinin veri seti ve temel modellerini barındırıyor.

- **FakeNewsNet:** [github.com/KaiDMML/FakeNewsNet](https://github.com/KaiDMML/FakeNewsNet)
  - *Not:* Sosyal medya verilerini çekmek ve grafik yapılarını kurmak için kullanılan Python scriptleri mevcut.

- **NewsCLIPp:** [github.com/g-luo/news_clipp](https://github.com/g-luo/news_clipp)
  - *Not:* CLIP mimarisinin haber doğrulama için özelleştirilmiş PyTorch kodlarını içeriyor.

- **ManTra-Net:** [github.com/ISICV/ManTra-Net](https://github.com/ISICV/ManTra-Net)
  - *Not:* Görüntü manipülasyonu tespiti için hazır modelleri (checkpoint) ve ısı haritası üreticisi mevcut.

- **DIRE:** [github.com/ZhendongWang6/DIRE](https://github.com/ZhendongWang6/DIRE)
  - *Not:* Difüzyon modellerini (DALL-E, Midjourney vb.) tespit eden en güncel repolardan biri.

---

## Makalesi Bulunmayan GitHub'da Bulunan Benzer Çalışmalar

Makaleleşmemiş ancak projemizin mantığına (OSINT/Ajan Araştırması) çok yakın olan projeler:

- **GPT-Researcher:** [github.com/assafelovic/gpt-researcher](https://github.com/assafelovic/gpt-researcher)
  - *Özelliği:* İnterneti otonom olarak tarayıp 20'den fazla kaynaktan veri çekerek kapsamlı rapor hazırlayan bir ajan sistemi.

- **OSINT-San:** [github.com/BullsEye0/osint-san](https://github.com/BullsEye0/osint-san)
  - *Özelliği:* Hedef kişi veya kurumlar hakkında dijital ayak izi toplayan Python tabanlı bir istihbarat aracı.

- **FactCheck-Agent:** [github.com/The-Fact-Check-Project/FactCheck-Agent](https://github.com/The-Fact-Check-Project/FactCheck-Agent)
  - *Özelliği:* LLM kullanarak iddiaları doğrulayan ve kaynakça gösteren bir framework çalışması.

---

## Agent Yönetimi İçin Kullanılan Teknolojiler

### 1. Popüler Ajan Çatıları

Bu araçlar, ajanların rollerini tanımlamanıza ve birbirleriyle nasıl etkileşime gireceklerini belirlemenize olanak tanır.

- **LangGraph:** Ajanları "durumlu" (stateful) ve döngüsel (cyclic) grafikler olarak tasarlamanızı sağlar. Kontrolün tamamen geliştiricide olduğu, karmaşık iş akışları için en güçlü araçlardan biridir.

- **CrewAI:** "Rol tabanlı" bir yaklaşım benimser. Bir yönetici, bir araştırmacı ve bir yazar gibi ajanlar tanımlayıp onları bir ekip (crew) gibi çalıştırır. Kullanımı oldukça kolay ve sonuç odaklıdır.

- **AutoGen:** Ajanlar arası diyaloğa odaklanır. Özelleştirilebilir ajanların birbirleriyle konuşarak problem çözmesini sağlar. Özellikle kod yazma ve hata ayıklama süreçlerinde çok başarılıdır.

### 2. Ajan Belleği ve Durum Yönetimi

Ajanların geçmiş konuşmaları hatırlaması ve uzun vadeli bilgilere erişmesi için kullanılır.

- **Mem0:** Ajanlar için "akıllı" bir bellek katmanıdır. Kullanıcı tercihlerini ve geçmiş etkileşimleri öğrenerek zamanla kişiselleşir.

### 3. Araç Kullanımı ve Çevre Etkileşimi

Ajanların dünyayla etkileşime girmesini (webde arama yapma, dosya okuma, API çağırma) sağlayan bileşenlerdir.

- **Composio:** Ajanları 100'den fazla dış uygulamaya (GitHub, Slack, Salesforce vb.) bağlamak için hazır araç setleri sunar.

- **MultiOn:** Ajanların web tarayıcılarını bir insan gibi kullanmasını (form doldurma, bilet alma) sağlayan bir "Web Agent" altyapısıdır.

---

## Kullanılabilir Teknolojiler

- **Tavily API:** Normal Google araması yerine, doğrudan yapay zeka ajanları için tasarlanmış bir arama motoru. Araştırma ajanları (GPT-Researcher gibi) bunu kullanıyor çünkü koca bir sitenin linkini vermek yerine, aradığın bilginin özetini temiz bir JSON formatında döndürüyor.

- **Trafilatura:** Sadece "haber metnini" çekmek istiyorsan mükemmel bir kütüphane. Sitedeki reklamları, menüleri, gereksiz HTML etiketlerini atıp direkt makalenin saf metnini LLM'in okuyabileceği formatta veriyor.

- **Chain-of-Verification (CoVe):** Model bir sonuç üretmeden önce kendi kendine "Bu söylediğim doğru mu?" diye teyit soruları çıkarıp, bunları cevapladıktan sonra son raporu sunması yaklaşımı.

# Simge & İsmail — Düğün Davetiyesi

Tek sayfalık, tamamen duyarlı (responsive) bir düğün davetiyesi.
Konsept: **“Kırmızı İp”** — davetiye kurdeleyle bağlı bir paket olarak açılıyor, çözülen
kurdele sayfanın tamamı boyunca akan kırmızı bir ipe dönüşüyor ve en sonda kendini
fiyonk yapıp bağlıyor.

Çerçeve yok, derleme yok, kurulum yok. `index.html`’e çift tıkla, açılır.

---

## Dosyalar

```
index.html        yapı
css/style.css     tüm tasarım ve animasyonlar
js/config.js      ⭐ DÜZENLEYECEĞİN TEK DOSYA — isimler, tarih, mekân, program…
js/main.js        animasyon ve etkileşim motoru
favicon.svg       sekme ikonu — kurdele (favicon-32.png / -180.png yedekleri)
photos/           fotoğraflarını buraya at (1.jpg … 5.jpg)
```

---

## 1. Bilgileri değiştir

Her şey [js/config.js](js/config.js) içinde. Başka hiçbir dosyaya dokunmana gerek yok:

| Alan                                  | Ne işe yarar                                                                |
| ------------------------------------- | --------------------------------------------------------------------------- |
| `gelin`, `damat`                      | Sayfadaki tüm isimler (kapak, başlık, monogram, WhatsApp mesajı)            |
| `tarihISO`                            | **Geri sayım ve takvim** bunu kullanır. ISO formatı, `+03:00` Türkiye saati |
| `tarihMetni`, `tarihKisa`, `gunMetni` | Ekranda yazıyla görünen tarih                                               |
| `program[]`                           | Günün akışı — istediğin kadar satır ekle/çıkar                              |
| `mekan`                               | Ad, ilçe, açık adres, telefon ve **Google Maps bağlantısı**                 |
| `hikaye[]`                            | “Bir varmış, bir yokmuş” bölümündeki anlar                                  |
| `galeri[]`                            | Fotoğraf yolları ve altlarındaki el yazısı notlar                           |
| `whatsapp`                            | LDS mesajının gideceği numara — `905xxxxxxxxx` (başında `+` ve boşluk yok)  |
| `eposta`                              | `whatsapp` alanını boş bırakırsan e-posta kullanılır                        |
| `ldsTarihi`                           | “Şu tarihe kadar haber ver” metni                                           |

> **Not:** Şu an dosyada duran _Simge & İsmail, 22 Mayıs 2027, Yalı Bahçe Konağı_
> bilgileri örnektir — kendi bilgilerinle değiştir.

## 2. Fotoğrafları koy

`photos/` klasörüne `1.jpg`, `2.jpg` … `5.jpg` olarak at.
Dosya yoksa sayfa bozulmaz; yerine elle çizilmiş bir zeytin dalı deseni gösterir.

Dikey/kare/yatay fark etmez — her çerçevenin kendi oranı var, fotoğraf kırpılarak oturur.
İdeal boyut: kenarı **1200–1600 px**, 300 KB altı (mobilde hızlı açılsın diye).

## 3. Yayına al

Statik bir site olduğu için her yere yüklenir:

- **Netlify / Vercel:** klasörü sürükle bırak, saniyeler içinde bağlantı verir
- **GitHub Pages:** repoya at, Settings → Pages
- **Kendi hostingin:** dosyaları FTP ile `public_html` içine at

Davetlilere tek bir bağlantı gönderirsin; WhatsApp’ta başlık ve açıklama önizlemesi
çıkar (`og:` etiketleri hazır).

---

## İçindeki animasyonlar

| Nerede     | Ne oluyor                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| Kapak      | Kurdele **aşağı sürüklenerek** ya da tıklanarak çözülüyor; fiyonk dağılıyor, kâğıt ikiye ayrılıp açılıyor |
| Açılış     | İsimler harf harf yükseliyor, “&” işareti kendini çiziyor, zeytin dalları dal dal büyüyor                 |
| Tüm sayfa  | Kırmızı ip kaydırmayla birlikte çiziliyor; ucunda bir düğüm ilerliyor, her bölümde bir düğüm atıyor       |
| Metinler   | Satırlar alttan maskelenerek açılıyor                                                                     |
| Hikâye     | Yıllar içi boş rakamlarla beliriyor, altlarındaki çizgi soldan sağa uzuyor                                |
| Program    | Bilet satırları sırayla geliyor                                                                           |
| Geri sayım | Rakamlar makara gibi dönüyor                                                                              |
| Mekân      | Harita çiziliyor, iğne zıplayarak düşüyor, güzergâh yürüyor                                               |
| Galeri     | Polaroidler eğik geliyor, kaydırırken farklı hızlarda süzülüyor                                           |
| Kapanış    | İp fiyonk olup bağlanıyor                                                                                 |
| Arka plan  | Rüzgârda savrulan yapraklar + kâğıt dokusu                                                                |

**Müzik kutusu:** sağ alttaki düğme. Ses dosyası yok — melodi tarayıcıda
Web Audio ile anlık üretiliyor. Varsayılan olarak kapalı.

## Erişilebilirlik & uyum

- `prefers-reduced-motion` açıksa tüm animasyonlar kapanır, içerik olduğu gibi görünür
- Klavye ile gezilebilir; kapak Enter/Space ile açılır
- Yazdırma (Ctrl+P) için ayrı stil var — kurdele, ip ve yapraklar çıkmaz
- Chrome, Edge, Safari, Firefox — masaüstü ve mobil

## Bilinmesi gerekenler

- **“Bize haber ver” bölümünde form yok.** Davetli düğmeye basınca hazır bir mesajla
  WhatsApp’ı (numara yoksa e-postayı) açıyor; altındaki numaraya da doğrudan
  dokunup arayabiliyor. Yanıtları otomatik toplamak istersen Google Forms /
  Netlify Forms bağlanabilir.
- Yazı tipleri (Fraunces, Manrope, Caveat) Google Fonts’tan gelir — ilk açılışta
  internet gerekir. Bağlantı yoksa sayfa yedek yazı tipleriyle yine düzgün görünür.

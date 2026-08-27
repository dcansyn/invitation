/* ============================================================
   DAVETİYE BİLGİLERİ  —  Sadece bu dosyayı düzenlemen yeterli.
   ============================================================ */

window.DAVET = {
  /* --- Çift --- */
  gelin: "Simge",
  damat: "İsmail",
  monogram: "S & İ",

  /* --- Tarih & Saat ---
     tarihISO: geri sayım ve takvim için (ISO 8601, +03:00 Türkiye saati) */
  tarihISO: "2026-10-11T17:30:00+03:00",
  bitisISO: "2026-10-11T22:00:00+03:00",
  gunMetni: "Pazar",
  tarihMetni: "11 Ekim 2026",
  tarihKisa: "11.10.2026",

  /* --- Günün akışı --- */
  program: [
    { saat: "17:30", baslik: "Düğün" },
    { saat: "18:00", baslik: "Nikah" },
    { saat: "18:20", baslik: "İlk Dans" },
    { saat: "20:30", baslik: "Dans & Kutlama" },
  ],

  /* --- Mekân --- */
  mekan: {
    ad: "Pion Bahçe",
    ilce: "Beykoz / İstanbul",
    adres: "Çavuşbaşı, Çengeldere, Çelenk Sokak No: 11 34810 Beykoz / İstanbul",
    telefon: "+90 533 150 75 28",
    mapsUrl: "https://maps.app.goo.gl/jdCUfmvqA8Pa1doP6",
  },

  /* --- Hikâye (istediğin kadar satır ekle/çıkar) --- */
  hikaye: [
    { yil: "2023", baslik: "İlk karşılaşma", metin: "Kalabalık bir şehir, aynı kitaba uzanan iki el." },
    { yil: "2024", baslik: "İlk heyecan", metin: "Verilmiş en güzel karar ile, sonsuz bir heyecan." },
    { yil: "2025", baslik: "İlk adım", metin: "Yüzüklerimizle birbirimize bağlandığımız ilk adım." },
    { yil: "2026", baslik: "İlk sayfa", metin: "Hayallerimizden masal kitaplarına uzanan yolculuk." },
  ],

  /* --- Fotoğraflar ---
     photos/ klasörüne 1.jpg … 5.jpg olarak at.
     Dosya yoksa otomatik olarak elle çizilmiş bir çerçeve gösterilir. */
  galeri: [
    { src: "photos/ilk.jpeg", not: "ilk fotoğrafımız" },
    { src: "photos/evlilik.jpeg", not: "o yaz" },
    { src: "photos/nisan.jpeg", not: "sonsuzluğa adım" },
    { src: "photos/mutluluk.jpeg", not: "mutluluklarımız" },
    { src: "photos/keyif.jpeg", not: "yolculuklarımız" },
  ],

  /* --- Geri dönüş (LDS) ---
     whatsapp: ülke kodu ile, başında + ve boşluk olmadan. Boş bırakırsan e-posta kullanılır. */
  whatsapp: "905331507528",
  eposta: "",
  ldsTarihi: "11 Ekim 2026",
};

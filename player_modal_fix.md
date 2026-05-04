# Player modal — uygulanan gereksinimler

1. **Mobil (≤768px):** Sezon/bölüm kontrolleri videonun **altında** görünsün (DOM sırası `flex-order` ile düzeltildi).
2. **Tam ekran:** Tam ekrandan çıkıldığında (ESC vb.) modal kapanmasın; yalnızca tam ekran sonlansın. Kapatma: X veya masaüstünde backdrop.
3. **Iframe hata:** Mümkün olduğunda `onError` ile “İçerik bulunamadı”; kaynak (`src`) değişince hata durumu sıfırlanır.
4. **Geliştirici:** “Son olay” ilerleme satırı yalnızca geliştirme ortamında (`import.meta.env.DEV`) gösterilir.

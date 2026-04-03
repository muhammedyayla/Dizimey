# CLAUDE — Project Context

Bu dosya, projeyi hızlıca kavramak için AI modellerine ve ekip üyelerine kalıcı bir bağlam sağlar.

## Proje genel bakış
- Bu proje, TMDB verilerini kullanarak film ve dizi keşfi, detay görüntüleme, izleme listesi ve oynatma takibi sağlayan React tabanlı bir kullanıcı arayüzüdür.
- Sunucu tarafı küçük bir Node/Express servisiyle kullanıcı kimlik doğrulaması, watchlist ve izleme ilerlemesi (watch-progress) verilerini PostgreSQL veritabanında saklar.

## Tech stack
- Diller: JavaScript (ESM), JSX
- Frontend: React 18, Vite 5, React Router (HashRouter)
- State: Redux Toolkit (@reduxjs/toolkit)
- UI / yardımcı kütüphaneler: @mui/material, swiper, react-icons, axios
- Backend: Node.js + Express (server/index.js)
- Veritabanı: PostgreSQL (pg)
- Auth: JWT (jsonwebtoken), bcryptjs
- Diğer: dotenv, cors, gh-pages (deploy script)

Versiyonlar (paket.json'dan özet): React 18.2.0, Vite 5.2.0, @reduxjs/toolkit 2.2.3, react-router-dom 6.23.0, axios 1.6.8, express 4.21.2, pg 8.11.3, jsonwebtoken 9.0.2.

## Mimari & yapı
Projenin ana klasör ağacı (2-3 seviye):

- index.html — Uygulama kabuğu (root)
- package.json, vite.config.js, vercel.json
- src/
  - main.jsx — Uygulama entry (ReactDOM) ve `Provider`/`HashRouter` sarmalayıcıları
  - App.jsx — Üst seviye route ve modals
  - components/ — Tekil UI bileşenleri (navbar, footer, player, modals vb.)
  - constants/ — API yolları ve sabitler
  - redux/
    - store.jsx — Redux store
    - slices/ — Uygulama dilimleri (player, ui, movieList, movieDetail, tvDetail, genre, favorites)
  - Pages/ — Sayfa düzeyinde bileşenler (Home, MovieDetail, SeriesDetail, MyList, Search)

- server/
  - index.js — Express uygulaması; JWT auth, DB bağlantısı, watchlist/watch-progress ve auth endpointleri
  - package.json, .env (sunucu ayarları)

- api/
  - index.js — Vercel serverless uyumluluğu için server/index.js'i dışa aktaran dosya

## Entry point(s)
- Frontend: `index.html` -> `src/main.jsx` (ReactDOM.createRoot)
- Backend (server): `server/index.js` (Express app). `api/index.js` Vercel yönlendirmesi için `export default app` içerir.

## Önemli konfigürasyon dosyaları
- `package.json` — scriptler, bağımlılıklar
- `vite.config.js` — Vite yapılandırması (base: '/Dizimey/' dikkat edilmesi gerekir)
- `vercel.json` — Vercel yönlendirme ve build ayarları
- `server/.env` ve `.env.example` — Veritabanı, JWT secret ve frontend URL ayarları

## Temel kavramlar & desenler
- State yönetimi: Redux Toolkit ile slice'lar; `Provider` root'ta sarılmış.
- Routing: `HashRouter` kullanılıyor (özellikle GitHub Pages veya statik hostlarda tercih edilmiş olabilir).
- API katmanı: Frontend `constants/api.jsx` + `axios` kullanıyor; backend Express ile REST endpointleri sunuyor.
- Auth akışı: Backend'de JWT temelli login/signup; `verifyToken` middleware ile korunan endpointler.
- DB: PostgreSQL bağlantısı `pg` Pool ile yönetiliyor; sorgular parametreli (prepared) kullanılıyor.

## Kesinlikle dokunulmaması gereken/özgül hassas alanlar
- `server/index.js` içindeki auth ve DB bağlantı mantığı — yanlış değişiklik güvenlik veya veri kaybına yol açabilir.
- `api/index.js` — Vercel için gerekli olan export; kaldırılmamalı.
- `vite.config.js`'deki `base` değeri — deploy edilmiş URL'ler için asset path'leri etkiler.
- Redux slice'larının shape'ı (özellikle `player`, `ui` ve `movieDetail`) — bileşenler bunlara doğrudan bağlıdır.

## Ortak pitfall'lar — bu kodda sık yapılan hatalar
- Ortam değişkenleri eksikse (DATABASE_URL, JWT_SECRET, FRONTEND_URL) backend başlatılamaz veya CORS hataları oluşur.
- `vite.config.js`'de `base` yanlış ayarlanırsa prod build asset yolları bozulur.
- HashRouter ile server side route uyuşmazlığı — server yönlendirmeleri düzgün yapılandırılmalı.
- Veritabanı şeması veya migration olmadan doğrudan sorgu kullanımı; prod'da eksik tablolar hata verir.

## Geliştirme komutları
- `npm run dev` — Geliştirme sunucusu (Vite)
- `npm run build` — Üretim build (Vite)
- `npm run preview` — Build sonrası preview
- `npm run lint` — ESLint kontrolü
- `npm run deploy` — `gh-pages` ile `dist` dizinini deploy etmeye yönelik script

## AI için çalışma kuralları
- Kod stiline uy: ESM import/export, fonksiyon bileşenleri, mevcut kod düzenini koru.
- Büyük değişikliklerden önce PR veya backup oluştur — özellikle `server/index.js`, `redux/*` ve `vite.config.js` için.
- Secrets: JWT secret veya DB bilgilerini dosyaya gömme; `.env` kullan ve `.env` içeriklerini repo'ya koyma.
- Test yok — riskleri azaltmak için küçük, izole değişiklikler yap ve manuel test et.

## Hangi dosyalara dikkatli yaklaşılmalı ve neden
- server/index.js — auth, DB, güvenlik
- api/index.js — Vercel yönlendirmesi
- vite.config.js — base path, build ayarları
- package.json — scriptler ve bağımlılıklar
- src/redux/* — global state shape ve actionlar
- src/constants/api.jsx — API anahtarları/URL'ler

## Son güncelleme
- Tarih: 2026-04-02
- Güncelleyen: AI analizi

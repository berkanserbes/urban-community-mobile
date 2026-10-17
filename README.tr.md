# Urban Community — Mobil Uygulama

[![CI](https://github.com/berkanserbes/urban-community-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/berkanserbes/urban-community-mobile/actions/workflows/ci.yml)
![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-000020)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](README.md) | **Türkçe**

Kentsel sorunların bildirilmesi ve çözülmesi için yapay zekâ destekli bir platform olan Urban
Community'nin vatandaş uygulaması. Vatandaşlar mahallelerindeki sorunları bildirir, çözülene kadar
takip eder, öneri paylaşır ve komşularına yardım eder.

## Repolar

| Repo | Açıklama |
| --- | --- |
| [urban-community-backend](https://github.com/berkanserbes/urban-community-backend) | ASP.NET Core API, RabbitMQ consumer'ları, PostgreSQL/PostGIS |
| [urban-community-ai-service](https://github.com/berkanserbes/urban-community-ai-service) | Kategorilendirme, önceliklendirme ve benzer rapor tespiti için FastAPI servisi |
| [urban-community-management-web](https://github.com/berkanserbes/urban-community-management-web) | React admin ve yetkili paneli |
| **[urban-community-mobile](https://github.com/berkanserbes/urban-community-mobile)** | Expo / React Native vatandaş uygulaması (bu repo) |

Genel mimari için [backend README](https://github.com/berkanserbes/urban-community-backend/blob/main/README.tr.md)
dosyasına bakın.

## Özellikler

- **Ana sayfa:** mahallendeki son raporlar, duyurular ve topluluk gönderileri.
- **Raporlar:** fotoğraflı ve haritadan seçilen konumlu rapor oluşturma. Backend'deki yapay zekâ
  servisi raporu kategorilendirir ve önceliğini belirler. Raporları mahalle, ilçe veya il bazında
  görüntüleme, kendi raporlarını duruma göre filtreleme ve her raporun durum geçmişini takip etme.
- **Öneriler:** mahallen için fikir paylaşma, artı/eksi oy verme, yorum yapma, kendi önerini
  düzenleme veya silme.
- **Topluluk:** fotoğraflı ve yorumlu yardım talebi, alet ödünç alma ve kayıp eşya gönderileri.
- **Duyurular:** iline, ilçene veya mahallene yönelik duyurular.
- **Bildirimler:** SignalR ile anlık bildirimler; okundu, okunmadı ve silme işlemleri.
- **Profil:** profil bilgilerini ve fotoğrafını düzenleme, şifre değiştirme ve mahalle güncelleme.
- **Listeler:** API sayfalamasıyla çalışan sonsuz kaydırma ve aşağı çekerek yenileme.
- Açık ve koyu tema.

## Teknolojiler

| Alan | Teknolojiler |
| --- | --- |
| Çatı | Expo SDK 54, React Native 0.81, React 19, TypeScript |
| Navigasyon | Expo Router (dosya tabanlı) |
| Veri çekme | TanStack Query (sonsuz sorgular dahil), Axios |
| Anlık iletişim | SignalR (`@microsoft/signalr`) |
| Durum yönetimi | Zustand |
| Formlar | React Hook Form, Zod |
| Stil | NativeWind (Tailwind CSS) |
| Cihaz özellikleri | Expo Location, Expo Image Picker, React Native Maps |

## Proje yapısı

```text
urban-community/
├── app/          # Expo Router ekranları: (auth) giriş ve kayıt, (app) sekmeler ve detay ekranları
├── components/   # Ortak arayüz bileşenleri (kartlar, rozetler, liste altlıkları)
├── features/     # Her alan için bir klasör: api/, hooks/ ve index.ts
├── lib/          # Axios ve SignalR istemcileri, sayfalama yardımcıları, araçlar
└── types/        # Özellikler arasında paylaşılan API tipleri
```

## Başlangıç

### Gereksinimler

- Node.js 20.19+ veya 22 ve [pnpm](https://pnpm.io/)
- Telefonda [Expo Go](https://expo.dev/go) uygulaması ya da bir Android veya iOS emülatörü
- Çalışan bir backend API (bkz. [backend README](https://github.com/berkanserbes/urban-community-backend/blob/main/README.tr.md#başlangıç))

### Çalıştırma

```bash
cd urban-community
pnpm install
cp .env.example .env
pnpm start
```

`.env` içindeki `EXPO_PUBLIC_API_BASE_URL` değerini cihazın erişebileceği bir adres yapın. Fiziksel
telefonda `localhost` telefonun kendisini gösterir; bu yüzden bilgisayarınızın yerel ağ IP adresini
kullanın (örneğin `http://192.168.1.20:5000`). Android emülatörü bilgisayarınıza
`http://10.0.2.2:5000` adresinden ulaşır.

QR kodu Expo Go ile okutun ya da emülatörde açmak için `a` (Android) veya `i` (iOS) tuşuna basın.

### Komutlar

| Komut | Açıklama |
| --- | --- |
| `pnpm start` | Expo geliştirme sunucusunu başlatır |
| `pnpm android` | Başlatır ve Android'de açar |
| `pnpm ios` | Başlatır ve iOS'ta açar |
| `pnpm lint` | `expo lint` ile ESLint'i çalıştırır |

## Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

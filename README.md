# Urban Community — Mobile App

![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-000020)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**English** | [Türkçe](README.tr.md)

The citizen app of Urban Community, an AI-assisted platform for reporting and resolving urban issues.
Citizens report problems in their neighborhood, follow them until they are resolved, share suggestions
and help their neighbors.

## Repositories

| Repository | Description |
| --- | --- |
| [urban-community-backend](https://github.com/berkanserbes/urban-community-backend) | ASP.NET Core API, RabbitMQ consumers, PostgreSQL/PostGIS |
| [urban-community-ai-service](https://github.com/berkanserbes/urban-community-ai-service) | FastAPI service for categorization, priority scoring and duplicate detection |
| [urban-community-management-web](https://github.com/berkanserbes/urban-community-management-web) | React admin and official panel |
| **[urban-community-mobile](https://github.com/berkanserbes/urban-community-mobile)** | Expo / React Native citizen app (this repository) |

See the [backend README](https://github.com/berkanserbes/urban-community-backend#readme) for the overall
architecture.

## Features

- **Home feed:** the latest reports from your neighborhood, announcements and community posts.
- **Reports:** create a report with photos and a location picked on the map. The backend's AI service
  categorizes and prioritizes it. Browse reports by neighborhood, district or province, filter your own
  reports by status and follow each report's status history.
- **Suggestions:** share ideas for your neighborhood, vote them up or down, comment, and edit or delete
  your own suggestions.
- **Community:** help requests, tool borrowing and lost & found posts with photos and comments.
- **Announcements:** announcements targeted at your province, district or neighborhood.
- **Notifications:** real-time notifications over SignalR with read, unread and delete actions.
- **Profile:** edit your profile and photo, change your password and update your neighborhood.
- **Lists:** infinite scrolling backed by the API's pagination, with pull-to-refresh.
- Light and dark mode.

## Tech stack

| Area | Technologies |
| --- | --- |
| Framework | Expo SDK 54, React Native 0.81, React 19, TypeScript |
| Navigation | Expo Router (file-based) |
| Data fetching | TanStack Query (including infinite queries), Axios |
| Real time | SignalR (`@microsoft/signalr`) |
| State | Zustand |
| Forms | React Hook Form, Zod |
| Styling | NativeWind (Tailwind CSS) |
| Device features | Expo Location, Expo Image Picker, React Native Maps |

## Project structure

```text
urban-community/
├── app/          # Expo Router screens: (auth) sign-in and sign-up, (app) tabs and detail screens
├── components/   # Shared UI components (cards, badges, list footers)
├── features/     # One folder per domain: api/, hooks/ and an index.ts barrel
├── lib/          # Axios and SignalR clients, pagination helpers, utilities
└── types/        # API types shared across features
```

## Getting started

### Prerequisites

- Node.js 20.19+ or 22 and [pnpm](https://pnpm.io/)
- The [Expo Go](https://expo.dev/go) app on your phone, or an Android or iOS emulator
- A running backend API (see the [backend README](https://github.com/berkanserbes/urban-community-backend#getting-started))

### Run

```bash
cd urban-community
pnpm install
cp .env.example .env
pnpm start
```

Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to an address your device can reach. On a physical phone,
`localhost` points to the phone itself, so use your computer's LAN IP address (for example
`http://192.168.1.20:5000`). The Android emulator reaches your computer at `http://10.0.2.2:5000`.

Scan the QR code with Expo Go, or press `a` (Android) or `i` (iOS) to open an emulator.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm start` | Start the Expo development server |
| `pnpm android` | Start and open on Android |
| `pnpm ios` | Start and open on iOS |
| `pnpm lint` | Run ESLint through `expo lint` |

## License

This project is licensed under the [MIT License](LICENSE).

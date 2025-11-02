# StepFit

A clean, modern step counter and fitness tracker built with Expo (React Native) and React Native Paper.

## Features

- Live step counting via device pedometer (Expo Sensors)
- Simple Dashboard with goal progress, distance, and calories estimates
- Activity, History, and Settings tabs
- Light/Dark theming with Material Design 3
- Simulator toggle for devices/emulators without a step sensor

## Prerequisites

- Node.js LTS and npm installed
- Android Studio or a physical Android device with USB debugging enabled
- Expo account (optional, recommended)

## Getting started

1. Install dependencies

```powershell
npm install
```

2. Start the development server

```powershell
npm run android
```

This will start Metro and open the app on your connected Android device or emulator. You can also run:

```powershell
npm start
```

…then press `a` for Android, `w` for web, or scan the QR code with Expo Go.

## Notes

- Emulators typically lack a step sensor. Use the Simulator toggle in Settings (or on Dashboard) to generate fake steps and try the UI.
- Background step tracking is not yet enabled; it will be added in a future iteration.

## Scripts

- `npm start` – start Expo dev server
- `npm run android` – run on Android
- `npm run ios` – run on iOS (macOS only)
- `npm run web` – run on web (limited fidelity)
- `npm run typecheck` – TypeScript type checking
- `npm test` – run tests (placeholder)

## License

MIT

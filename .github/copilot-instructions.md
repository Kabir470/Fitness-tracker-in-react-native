<!-- Workspace-specific instructions for Copilot. Keep this checklist up to date. -->

- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements
  - Expo-managed React Native app (TypeScript) for a step counter and fitness tracker with a polished Android-like UI.

- [x] Scaffold the Project
  - Initialized Expo RN app in current folder.
  - Added React Navigation (bottom tabs), React Native Paper, expo-sensors, AsyncStorage.
  - Set up screens (Dashboard, Activity, History, Settings), context, theme, and storage.

- [x] Customize the Project
  - Implemented Step context with Pedometer + simulator, themed UI, and initial screens.

- [x] Install Required Extensions
  - No specific VS Code extensions were mandated; skipping.

- [x] Compile the Project
  - Installed dependencies (npm install).
  - Typecheck passes (npm run typecheck).
  - Tests pass (npm test).

- [ ] Create and Run Task
  - Not required at this stage; can add tasks.json later if needed.

- [ ] Launch the Project
  - Run locally with `npm run android` or `npm start` and press `a`.

- [x] Ensure Documentation is Complete
  - README.md contains setup and run instructions.

Notes:

- Background step tracking (Android) is not implemented yet; planned as an optional enhancement.

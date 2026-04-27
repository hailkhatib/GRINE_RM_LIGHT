import Constants from 'expo-constants';

export const TIERS = {
  // ... (same as before)
  LIGHT: {
    id: 'LIGHT',
    name: 'LIGHT',
    maxEst: 1,
    maxApt: 1,
    languages: ['fr', 'en', 'es'],
    styles: ['dark'],
    allowedDays: [3],
    buyLink: 'https://apps.apple.com/app/grine-rm-light'
  },
  ADVANCED: {
    id: 'ADVANCED',
    name: 'ADVANCED',
    maxEst: 1,
    maxApt: 3,
    languages: ['fr', 'en', 'es'],
    styles: ['dark', 'classic'],
    allowedDays: [3, 7],
    buyLink: 'https://apps.apple.com/app/grine-rm-advanced'
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'PREMIUM',
    maxEst: 5,
    maxApt: 5,
    languages: ['fr', 'en', 'es'],
    styles: ['dark', 'classic', 'fun', 'coastal'],
    allowedDays: [3, 7, 15],
    buyLink: 'https://apps.apple.com/app/grine-rm-premium'
  }
};

// Reads the tier from the build configuration (app.config.js)
const BUILD_TIER = Constants.expoConfig?.extra?.tier;
export const CURRENT_TIER_KEY = BUILD_TIER || 'PREMIUM';

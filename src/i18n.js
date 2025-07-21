// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Localization from 'expo-localization';
// import { I18nManager } from 'react-native';

// import en from './locales/en.json';
// import hi from './locales/hi.json';

// const LANGUAGE_DETECTOR = {
//   type: 'languageDetector',
//   async: true,
//   detect: async (cb) => {
//     const savedDataJSON = await AsyncStorage.getItem('user-language');
//     const lng = savedDataJSON ? savedDataJSON : Localization.locale;
//     cb(lng);
//   },
//   init: () => {},
//   cacheUserLanguage: async (lng) => {
//     await AsyncStorage.setItem('user-language', lng);
//   },
// };

// i18n
//   .use(LANGUAGE_DETECTOR)
//   .use(initReactI18next)
//   .init({
//     fallbackLng: 'en',
//     compatibilityJSON: 'v3',
//     resources: {
//       en: { translation: en },
//       hi: { translation: hi },
//     },
//     react: {
//       useSuspense: false,
//     },
//   });

// export default i18n;


// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import hi from './locales/hi.json';

const LANG_KEY = 'APP_LANGUAGE';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

const fallbackLng = 'en';

// Load saved language or fallback to device locale
const getStoredLanguage = async () => {
  try {
    const savedLang = await AsyncStorage.getItem(LANG_KEY);
    return savedLang || RNLocalize.getLocales()[0]?.languageCode || fallbackLng;
  } catch (error) {
    return fallbackLng;
  }
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  fallbackLng,
  lng: fallbackLng, // temp
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false,
  },
});

// Set real language from AsyncStorage after init
getStoredLanguage().then((lng) => {
  i18n.changeLanguage(lng);
});

export const changeAppLanguage = async (lang) => {
  try {
    await AsyncStorage.setItem(LANG_KEY, lang);
    await i18n.changeLanguage(lang);
  } catch (err) {
    console.log('Language change error:', err);
  }
};

export default i18n;

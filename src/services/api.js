import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { parseCalendar } from '../utils/calendarUtils';

const STORAGE_KEY = '@apartments_data';
const BLOCKED_UIDS_KEY = '@blocked_uids';
const LANGUAGE_KEY = '@app_language';
const DASHBOARD_VERSION_KEY = '@dashboard_version';

export const getLanguage = async () => {
  try {
    const value = await AsyncStorage.getItem(LANGUAGE_KEY);
    return value !== null ? value : 'fr';
  } catch (e) {
    return 'fr';
  }
};

export const saveLanguage = async (val) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, val);
  } catch (e) {
    console.error('Save lang error:', e);
  }
};

export const getDashboardVersion = async () => {
  try {
    const value = await AsyncStorage.getItem(DASHBOARD_VERSION_KEY);
    return value !== null ? value : 'dark';
  } catch (e) {
    return 'dark';
  }
};

export const saveDashboardVersion = async (val) => {
  try {
    await AsyncStorage.setItem(DASHBOARD_VERSION_KEY, val);
  } catch (e) {
    console.error('Save dashboard version error:', e);
  }
};

// Adresse IP de votre PC (Détectée ou forcée)
const PC_IP = Constants.expoConfig?.hostUri?.split(':')[0] || '192.168.1.82';

/**
 * Proxy de secours : Netlify Function (Serveur)
 * C'est notre arme secrète contre les erreurs 403 de Booking.com
 */
const NETLIFY_PROXY = (url) => {
  const encoded = encodeURIComponent(url);
  
  // Detection adaptative du serveur de proxy
  let baseUrl = '';
  if (__DEV__) {
    // Si on est sur un navigateur PC (Web), localhost fonctionne très bien
    // Si on est sur Mobile (Expo Go), on utilise l'IP de l'ordinateur
    const isWeb = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    baseUrl = isWeb ? 'http://localhost:8888' : `http://${PC_IP}:8888`;
  }

  return `${baseUrl}/.netlify/functions/proxy-ical?url=${encoded}`;
};

// Fallbacks de secours (Publics) - Mis à jour avec des serveurs plus robustes
const PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://cors-anywhere.herokuapp.com/${url}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

export const getEstablishments = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      // Migration : si les données sont une liste plate d'appartements
      if (data.length > 0 && data[0].hasOwnProperty('icalUrl')) {
        return [{
          id: 'default_establishment',
          name: 'Mon Établissement Principal',
          apartments: data
        }];
      }
      return data;
    }
    return [];
  } catch (e) {
    return [];
  }
};

export const saveEstablishments = async (establishments) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(establishments));
  } catch (e) {
    console.error('Save error:', e);
  }
};

// --- NOUVEAUX HELPERS POUR LES BLOCAGES MANUELS ---

export const getBlockedUids = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(BLOCKED_UIDS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const saveBlockedUids = async (uids) => {
  try {
    await AsyncStorage.setItem(BLOCKED_UIDS_KEY, JSON.stringify(uids));
  } catch (e) {
    console.error('Save blocked UIDs error:', e);
  }
};

// --------------------------------------------------

export const fetchCalendarData = async (url) => {
  // 1. Essai prioritaire avec notre Proxy Netlify
  try {
    const response = await fetch(NETLIFY_PROXY(url));
    if (response.ok) {
      const text = await response.text();
      return parseCalendar(text);
    }
  } catch (e) {
    console.warn('Netlify Proxy failed, trying fallbacks...');
  }

  // 2. Fallbacks si le serveur Netlify est indisponible
  for (const proxyFn of PROXIES) {
    try {
      const proxyUrl = proxyFn(url);
      const response = await fetch(proxyUrl);
      if (response.ok) {
        const text = await response.text();
        return parseCalendar(text);
      }
    } catch (e) {
      continue;
    }
  }

  throw new Error('Echec Sync : Aucun proxy n’a fonctionné');
};

export const refreshAll = async (establishments) => {
  const promises = establishments.map(async (est) => {
    const updatedApts = await Promise.all(
      est.apartments.map(async (apt) => {
        try {
          if (!apt.icalUrl) return apt;
          const events = await fetchCalendarData(apt.icalUrl);
          return { ...apt, events, lastSync: new Date().toISOString(), error: null };
        } catch (e) {
          return { ...apt, error: e.message };
        }
      })
    );
    return { ...est, apartments: updatedApts };
  });

  return Promise.all(promises);
};

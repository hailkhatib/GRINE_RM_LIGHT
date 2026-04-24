import ICAL from 'ical.js';
import { format, addDays, startOfDay, parseISO, differenceInDays } from 'date-fns';

export const parseCalendar = (icalData) => {
  if (!icalData) return [];
  try {
    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);
    const veventList = comp.getAllSubcomponents('vevent');
    return veventList.map(vevent => {
      const event = new ICAL.Event(vevent);
      
      const startDay = event.startDate.day.toString().padStart(2, '0');
      const startMonth = event.startDate.month.toString().padStart(2, '0');
      const startYear = event.startDate.year;
      
      const endDay = event.endDate.day.toString().padStart(2, '0');
      const endMonth = event.endDate.month.toString().padStart(2, '0');
      const endYear = event.endDate.year;

      const startDate = `${startYear}-${startMonth}-${startDay}`;
      const endDate = `${endYear}-${endMonth}-${endDay}`;
      
      const duration = differenceInDays(parseISO(endDate), parseISO(startDate));

      return {
        uid: event.uid,
        summary: (event.summary || '').trim(),
        description: (event.description || '').trim(),
        startDate,
        endDate,
        duration
      };
    });
  } catch (error) {
    return [];
  }
};

export const getStatusForDate = (date, events, blockedUids = []) => {
  if (!events || !Array.isArray(events)) return 'libre';
  const targetKey = format(date, 'yyyy-MM-dd');
  
  const bookings = [];
  const blocks = [];

  events.forEach(e => {
    const s = e.summary.toUpperCase();
    
    // PRIORITÉ 1: L'utilisateur l'a marqué manuellement comme blocage
    const isManuallyBlocked = blockedUids.includes(e.uid);
    
    if (isManuallyBlocked) {
      blocks.push(e);
      return;
    }

    // PRIORITÉ 2: Détection automatique par mots-clés
    const isBlockKeyword = (s === 'CLOSED' || s === 'BLOCKED' || s === 'FERMÉ' || s === 'INDISPONIBLE' || s.includes('BLOC')) && !s.includes('NOT AVAILABLE');

    if (isBlockKeyword) {
      blocks.push(e);
    } else if (s.includes('NOT AVAILABLE') || s.includes('BOOKING') || s.includes('RESERVED') || /\d/.test(s)) {
      bookings.push(e);
    } else {
      bookings.push(e);
    }
  });

  // 1. Priorité aux réservations (E, S, O, ES)
  const hasIn = bookings.some(e => e.startDate === targetKey);
  const hasOut = bookings.some(e => e.endDate === targetKey);
  const hasStay = bookings.some(e => targetKey > e.startDate && targetKey < e.endDate);

  if (hasIn && hasOut) return 'depart-arrivee';
  if (hasIn) return 'arrivee';
  if (hasOut) return 'depart';
  if (hasStay) return 'occupe';

  // 2. Gestion des blocages (B)
  const isBlocked = blocks.some(e => targetKey >= e.startDate && targetKey < e.endDate);
  if (isBlocked) return 'ferme';
  
  return 'libre';
};

export const getTimelineDates = (daysCount) => {
  const today = startOfDay(new Date());
  return Array.from({ length: daysCount }, (_, i) => addDays(today, i));
};

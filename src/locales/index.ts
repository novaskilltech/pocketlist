import fr from './fr';
import en from './en';
import es from './es';
import ar from './ar';
import it from './it';
import nl from './nl';

export type Locale = 'fr' | 'en' | 'es' | 'ar' | 'it' | 'nl';

export const LOCALE_META: Record<Locale, { label: string; flag: string; dir: 'ltr' | 'rtl' }> = {
    fr: { label: 'Français', flag: '🇫🇷', dir: 'ltr' },
    en: { label: 'English', flag: '🇬🇧', dir: 'ltr' },
    es: { label: 'Español', flag: '🇪🇸', dir: 'ltr' },
    ar: { label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    it: { label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
    nl: { label: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
};

export const locales: Record<Locale, Record<string, string>> = { fr, en, es, ar, it, nl };

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { locales, Locale, LOCALE_META } from './locales';

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | null>(null);

function detectLocale(): Locale {
    const saved = localStorage.getItem('pocketlist_lang');
    if (saved && saved in locales) return saved as Locale;

    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    const match = Object.keys(locales).find(k => k === browserLang);
    return (match as Locale) || 'fr';
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(detectLocale);

    const setLocale = (l: Locale) => {
        setLocaleState(l);
        localStorage.setItem('pocketlist_lang', l);
    };

    const t = (key: string): string => {
        return locales[locale]?.[key] || locales['fr'][key] || key;
    };

    const dir = LOCALE_META[locale]?.dir || 'ltr';

    useEffect(() => {
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', locale);
    }, [locale, dir]);

    return (
        <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
    return ctx;
}

export { LOCALE_META, type Locale };

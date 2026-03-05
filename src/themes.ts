export type ThemeId = 'gunmetal' | 'ivory-smoke' | 'metallic-gold' | 'orchid-mirage' | 'sapphire-nightfall' | 'lavender-cashmere';

export interface Theme {
    id: ThemeId;
    name: string;
    emoji: string;
    premium: boolean;
    // CSS variable values
    bg: string;           // main background
    surface: string;      // card/panel surface
    border: string;       // border
    accent: string;       // primary accent (buttons, highlights)
    accentFg: string;     // text on accent
    text: string;         // primary text
    textMuted: string;    // muted text
    cardBg: string;       // item card backgrounds
}

export const THEMES: Theme[] = [
    {
        id: 'gunmetal',
        name: 'Gunmetal',
        emoji: '🖤',
        premium: false,
        bg: '#00272B',
        surface: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        accent: '#E0FF4F',
        accentFg: '#00272B',
        text: '#ffffff',
        textMuted: 'rgba(255,255,255,0.4)',
        cardBg: 'rgba(255,255,255,0.04)',
    },
    {
        id: 'ivory-smoke',
        name: 'Ivory Smoke',
        emoji: '🤍',
        premium: false,
        bg: '#FAF9F6',
        surface: 'rgba(172,166,154,0.12)',
        border: 'rgba(172,166,154,0.35)',
        accent: '#ACA69A',
        accentFg: '#ffffff',
        text: '#2C2925',
        textMuted: 'rgba(44,41,37,0.45)',
        cardBg: 'rgba(220,215,206,0.25)',
    },
    {
        id: 'metallic-gold',
        name: 'Metallic Gold',
        emoji: '✨',
        premium: true,
        bg: '#3D342F',
        surface: 'rgba(166,138,100,0.12)',
        border: 'rgba(248,227,180,0.2)',
        accent: '#F8E3B4',
        accentFg: '#3D342F',
        text: '#F8E3B4',
        textMuted: 'rgba(248,227,180,0.45)',
        cardBg: 'rgba(166,138,100,0.1)',
    },
    {
        id: 'orchid-mirage',
        name: 'Orchid Mirage',
        emoji: '💜',
        premium: true,
        bg: '#3A294F',
        surface: 'rgba(141,104,170,0.15)',
        border: 'rgba(244,214,255,0.2)',
        accent: '#9B6DBF',
        accentFg: '#ffffff',
        text: '#F4D6FF',
        textMuted: 'rgba(244,214,255,0.45)',
        cardBg: 'rgba(141,104,170,0.1)',
    },
    {
        id: 'sapphire-nightfall',
        name: 'Sapphire Night',
        emoji: '🌊',
        premium: true,
        bg: '#0B0F2B',
        surface: 'rgba(47,75,128,0.2)',
        border: 'rgba(96,120,164,0.3)',
        accent: '#6078A4',
        accentFg: '#ffffff',
        text: '#E8EEF8',
        textMuted: 'rgba(232,238,248,0.45)',
        cardBg: 'rgba(47,75,128,0.12)',
    },
    {
        id: 'lavender-cashmere',
        name: 'Lavender Cashmere',
        emoji: '🪻',
        premium: true,
        bg: '#EDE4F0',
        surface: 'rgba(168,139,193,0.15)',
        border: 'rgba(168,139,193,0.35)',
        accent: '#A88BC1',
        accentFg: '#ffffff',
        text: '#2A1B3D',
        textMuted: 'rgba(42,27,61,0.45)',
        cardBg: 'rgba(203,180,212,0.25)',
    },
];

export function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', theme.bg);
    root.style.setProperty('--theme-surface', theme.surface);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-accent-fg', theme.accentFg);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-muted', theme.textMuted);
    root.style.setProperty('--theme-card-bg', theme.cardBg);
    root.setAttribute('data-theme', theme.id);
}

export function getStoredThemeId(): ThemeId {
    return (localStorage.getItem('pl-theme') as ThemeId) || 'gunmetal';
}

export function storeThemeId(id: ThemeId) {
    localStorage.setItem('pl-theme', id);
}

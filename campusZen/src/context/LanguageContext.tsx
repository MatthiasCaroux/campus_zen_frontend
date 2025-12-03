import React, { createContext, useState, useContext, ReactNode } from 'react';
import translationsData from '../constants/translations.json';

// Define the structure of our translations
type TranslationKey = keyof typeof translationsData;
type Language = 'fr' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('fr');

    const t = (key: TranslationKey): string => {
        const translationEntry = translationsData[key];
        if (!translationEntry) {
            console.warn(`Translation key "${key}" not found.`);
            return String(key);
        }
        return translationEntry[language] || String(key);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};

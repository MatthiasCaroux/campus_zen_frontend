import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../context/LanguageContext';

interface LanguageSelectorProps {
    compact?: boolean;
}

const LanguageSelector = ({ compact = false }: LanguageSelectorProps) => {
    const { language, setLanguage, t } = useTranslation();

    if (compact) {
        return (
            <View style={styles.compactContainer}>
                <TouchableOpacity
                    style={[styles.compactButton, language === 'fr' && styles.compactActiveButton]}
                    onPress={() => setLanguage('fr')}
                >
                    <Text style={[styles.compactButtonText, language === 'fr' && styles.compactActiveText]}>FR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.compactButton, language === 'en' && styles.compactActiveButton]}
                    onPress={() => setLanguage('en')}
                >
                    <Text style={[styles.compactButtonText, language === 'en' && styles.compactActiveText]}>EN</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{t('change_language')}: {language.toUpperCase()}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, language === 'fr' && styles.activeButton]}
                    onPress={() => setLanguage('fr')}
                >
                    <Text style={styles.buttonText}>FR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, language === 'en' && styles.activeButton]}
                    onPress={() => setLanguage('en')}
                >
                    <Text style={styles.buttonText}>EN</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
    },
    text: {
        marginBottom: 10,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    activeButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        fontWeight: 'bold',
    },
    // Compact styles for header
    compactContainer: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        padding: 3,
    },
    compactButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 17,
    },
    compactActiveButton: {
        backgroundColor: '#007AFF',
    },
    compactButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    compactActiveText: {
        color: '#fff',
    },
});

export default LanguageSelector;

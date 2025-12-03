import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../context/LanguageContext';

const LanguageSelector = () => {
    const { language, setLanguage, t } = useTranslation();

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
});

export default LanguageSelector;

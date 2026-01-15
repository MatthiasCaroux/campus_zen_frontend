import React, { useEffect, useMemo, useState } from 'react';
import * as colors from "../theme/colors.js";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../context/LanguageContext';
import { getStoredUser, getStatuts } from '../services/AuthService';


export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [showConsultEtat, setShowConsultEtat] = useState(false);

  const todayLabel = useMemo(() => {
    const now = new Date();
    let day = now.toLocaleDateString(undefined, { weekday: 'long' });
    day = day.charAt(0).toUpperCase()+ day.slice(1);
    const date = now.toLocaleDateString(undefined, { day: '2-digit' });
    let month = now.toLocaleDateString(undefined, { month: 'long' });
    month = month.charAt(0).toUpperCase() + month.slice(1);
    return `${day} ${date} ${month}`;
  }, []);

  useEffect(() => {
    const checkStatut = async () => {
      try {
        const user = await getStoredUser();
        if (user && user.idPers) {
          const statuts = await getStatuts();
          const hasStatut = Array.isArray(statuts) && statuts.some((s) => s.personne === user.idPers);
          setShowConsultEtat(hasStatut);
        } else {
          setShowConsultEtat(false);
        }
      } catch {
        setShowConsultEtat(false);
      }
    };
    checkStatut();
  }, []);

  return (
    <LinearGradient
      colors={[colors.COULEUR_HEADER_BLEU, colors.COULEUR_FOND_BLEU_CLAIR]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRow}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoHeader}
              resizeMode="contain"
            />
          </View>

          <View style={styles.datePill}>
            <Ionicons name="calendar-outline" size={16} color={colors.COULEUR_WHITE} />
            <Text style={styles.datePillText}>{todayLabel}</Text>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="cloud" size={40} color={colors.COULEUR_WHITE} />
              <Ionicons name="sunny" size={18} color={colors.COULEUR_SOLEIL} style={styles.sunIcon} />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>{t('home_hero_title')}</Text>
              <Text style={styles.heroSubtitle}>{t('motivational_message')}</Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('home_checkin_title')}</Text>

            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.actionCard, styles.actionCardPrimary]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Questionnaire')}
              >
                <View style={styles.actionCardTopRow}>
                  <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                    <Ionicons name="heart-outline" size={20} color={colors.COULEUR_WHITE} />
                  </View>
                  <Ionicons name="arrow-forward" size={18} color={colors.COULEUR_WHITE} style={{ opacity: 0.9 }} />
                </View>
                <Text style={styles.actionCardTitle}>{t('home_checkin_cta')}</Text>
                <Text style={styles.actionCardSubtitle}>{t('home_checkin_hint')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionCard,
                  styles.actionCardSecondary,
                  !showConsultEtat && styles.actionCardDisabled,
                ]}
                activeOpacity={0.9}
                disabled={!showConsultEtat}
                onPress={() => navigation.navigate('ConsultEtat')}
              >
                <View style={styles.actionCardTopRow}>
                  <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                    <Ionicons name="pulse-outline" size={20} color={colors.COULEUR_WHITE} />
                  </View>
                  <Ionicons name="arrow-forward" size={18} color={colors.COULEUR_WHITE} style={{ opacity: 0.9 }} />
                </View>
                <Text style={styles.actionCardTitle}>{t('consult_status')}</Text>
                <Text style={styles.actionCardSubtitle}>
                  {showConsultEtat ? t('home_status_hint') : t('home_status_hint_empty')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('home_inspiration_title')}</Text>

            <TouchableOpacity style={[styles.miniButton, styles.miniButtonVideo]} activeOpacity={0.9}>
              <View style={styles.miniButtonRow}>
                <View style={[styles.youtubeIcon, styles.youtubeIconVideo]}>
                  <Ionicons name="play" size={16} color={colors.COULEUR_WHITE} />
                </View>
                <Text style={styles.miniButtonText}>{t('watch_video')}</Text>
                <View style={[styles.miniBadge, styles.miniBadgeVideo]}>
                  <Text style={styles.miniBadgeText}>{t('home_video_badge')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.COULEUR_TEXT_DARK} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.miniButton, styles.miniButtonPodcast]} activeOpacity={0.9}>
              <View style={styles.miniButtonRow}>
                <View style={[styles.youtubeIcon, styles.youtubeIconPodcast]}>
                  <Ionicons name="mic" size={16} color={colors.COULEUR_WHITE} />
                </View>
                <Text style={styles.miniButtonText}>{t('listen_podcast')}</Text>
                <View style={[styles.miniBadge, styles.miniBadgePodcast]}>
                  <Text style={styles.miniBadgeText}>{t('home_podcast_badge')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.COULEUR_TEXT_DARK} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 6,
  },
  logoHeader: {
    width: 120,
    height: 120,
  },
  datePill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 14,
  },
  datePillText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 12,
    fontWeight: '600',
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    marginBottom: 18,
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 14,
  },
  sunIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    color: colors.COULEUR_WHITE,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.COULEUR_WHITE,
    marginBottom: 15,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    minHeight: 130,
    shadowColor: colors.COULEUR_BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },
  actionCardPrimary: {
    backgroundColor: '#2E7CF6',
  },
  actionCardSecondary: {
    backgroundColor: '#6B4EFF',
  },
  actionCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardTitle: {
    color: colors.COULEUR_WHITE,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  actionCardSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    lineHeight: 18,
  },
  actionCardDisabled: {
    opacity: 0.6,
  },
  whiteCardButton: {
    backgroundColor: colors.COULEUR_WHITE,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: colors.COULEUR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  whiteCardButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  whiteCardIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteCardTitle: {
    fontSize: 15,
    color: colors.COULEUR_TEXT_DARK,
    fontWeight: '800',
  },
  whiteCardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
  miniButton: {
    backgroundColor: colors.COULEUR_WHITE,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: colors.COULEUR_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  miniButtonVideo: {
    borderLeftWidth: 4,
    borderLeftColor: colors.COULEUR_YOUTUBE,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  miniButtonPodcast: {
    borderLeftWidth: 4,
    borderLeftColor: '#6B4EFF',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  miniButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  youtubeIcon: {
    backgroundColor: colors.COULEUR_YOUTUBE,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youtubeIconVideo: {
    backgroundColor: colors.COULEUR_YOUTUBE,
  },
  youtubeIconPodcast: {
    backgroundColor: '#6B4EFF',
  },
  miniButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.COULEUR_TEXT_DARK,
    lineHeight: 18,
  },
  miniBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  miniBadgeVideo: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
  },
  miniBadgePodcast: {
    backgroundColor: 'rgba(107, 78, 255, 0.14)',
  },
  miniBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.72)',
    letterSpacing: 0.3,
  },
});
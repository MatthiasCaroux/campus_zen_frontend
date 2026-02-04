import React, { useEffect, useMemo, useState, useRef } from 'react';
import { COULEUR_BLEU_FONCE, COULEUR_HEADER_BLEU, COULEUR_FOND_BLEU_CLAIR, COULEUR_WHITE, COULEUR_SOLEIL, COULEUR_TEXT_DARK, COULEUR_YOUTUBE } from "../theme/colors";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../context/LanguageContext';
import { getStoredUser, getStatuts } from '../services/AuthService';
import { getRessources } from '../services/RessourceProvider';
import Ressource from '../types/Ressource';
import AnimatedSparkle from '../components/AnimatedSparkle';
import AnimatedButton from '../components/AnimatedButton';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [showConsultEtat, setShowConsultEtat] = useState(false);
  const [videoRessource, setVideoRessource] = useState<Ressource | null>(null);
  const [podcastRessource, setPodcastRessource] = useState<Ressource | null>(null);

  // Animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animation du logo
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation du contenu avec délai
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);
  }, []);

  useEffect(() => {
    const fetchInspiration = async () => {
      try {
        const user = await getStoredUser();
        const statuts = await getStatuts();
        let climatId: number | null = null;
        if (user && user.idPers && Array.isArray(statuts)) {
          const userStatuts = statuts.filter((s) => s.personne === user.idPers);
          if (userStatuts.length > 0) {
            const lastStatut = userStatuts.reduce((latest, current) => {
              return new Date(current.dateStatut) > new Date(latest.dateStatut) ? current : latest;
            }, userStatuts[0]);
            climatId = lastStatut.climat;
          }
        }
        const ressources = await getRessources();
        let filtered = ressources;
        if (climatId !== null) {
          filtered = ressources.filter((r: Ressource) => String(r.climat) === String(climatId));
        }

        const randomFrom = (arr: Ressource[]) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

        let videos = filtered.filter((r: Ressource) => r.typeR === 'video');
        if (videos.length === 0) {
          videos = ressources.filter((r: Ressource) => r.typeR === 'video');
        }
        setVideoRessource(randomFrom(videos));

        let podcasts = filtered.filter((r: Ressource) => r.typeR === 'podcast');
        if (podcasts.length === 0) {
          podcasts = ressources.filter((r: Ressource) => r.typeR === 'podcast');
        }
        setPodcastRessource(randomFrom(podcasts));
      } catch (e) {
        setVideoRessource(null);
        setPodcastRessource(null);
      }
    };
    fetchInspiration();
  }, []);

  const todayLabel = useMemo(() => {
    const now = new Date();
    let day = now.toLocaleDateString(undefined, { weekday: 'long' });
    day = day.charAt(0).toUpperCase() + day.slice(1);
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
      colors={[COULEUR_HEADER_BLEU, COULEUR_FOND_BLEU_CLAIR]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <Animated.View style={[styles.logoSection, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <View style={styles.mascotContainer}>
            <AnimatedSparkle style={styles.sparkleTop} />
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.datePill}>
            <Ionicons name="calendar-outline" size={14} color={COULEUR_WHITE} />
            <Text style={styles.datePillText}>{todayLabel}</Text>
          </View>
        </Animated.View>

        {/* Content Section */}
        <Animated.View style={[styles.contentSection, { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }]}>
          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="sunny" size={28} color={COULEUR_SOLEIL} />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>{t('home_hero_title')}</Text>
              <Text style={styles.heroSubtitle}>{t('motivational_message')}</Text>
            </View>
          </View>

          {/* Check-in Section */}
          <Text style={styles.sectionTitle}>{t('home_checkin_title')}</Text>
          <View style={styles.gridRow}>
            <AnimatedButton
              style={[styles.actionCard, styles.actionCardPrimary]}
              onPress={() => navigation.navigate('Questionnaire')}
            >
              <View style={styles.actionCardTopRow}>
                <View style={styles.actionIcon}>
                  <Ionicons name="heart-outline" size={20} color={COULEUR_WHITE} />
                </View>
                <Ionicons name="arrow-forward" size={18} color={COULEUR_WHITE} />
              </View>
              <Text style={styles.actionCardTitle}>{t('home_checkin_cta')}</Text>
              <Text style={styles.actionCardSubtitle}>{t('home_checkin_hint')}</Text>
            </AnimatedButton>

            <AnimatedButton
              style={[
                styles.actionCard,
                styles.actionCardSecondary,
                !showConsultEtat && styles.actionCardDisabled,
              ]}
              onPress={() => showConsultEtat && navigation.navigate('ConsultEtat')}
            >
              <View style={styles.actionCardTopRow}>
                <View style={styles.actionIcon}>
                  <Ionicons name="pulse-outline" size={20} color={COULEUR_WHITE} />
                </View>
                <Ionicons name="arrow-forward" size={18} color={COULEUR_WHITE} />
              </View>
              <Text style={styles.actionCardTitle}>{t('consult_status')}</Text>
              <Text style={styles.actionCardSubtitle}>
                {showConsultEtat ? t('home_status_hint') : t('home_status_hint_empty')}
              </Text>
            </AnimatedButton>
          </View>

          {/* Inspiration Section */}
          <Text style={styles.sectionTitle}>{t('home_inspiration_title')}</Text>

          <TouchableOpacity
            style={[styles.miniButton, styles.miniButtonVideo]}
            activeOpacity={0.8}
            disabled={!videoRessource}
            onPress={() => {
              if (videoRessource) {
                // @ts-ignore
                if (window && window.open) window.open(videoRessource.lienR, '_blank');
              }
            }}
          >
            <View style={styles.miniButtonRow}>
              <View style={[styles.mediaIcon, styles.mediaIconVideo]}>
                <Ionicons name="play" size={14} color={COULEUR_WHITE} />
              </View>
              <Text style={styles.miniButtonText} numberOfLines={1}>
                {videoRessource ? videoRessource.titreR : t('watch_video')}
              </Text>
              <View style={[styles.badge, styles.badgeVideo]}>
                <Text style={styles.badgeText}>{t('home_video_badge')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.miniButton, styles.miniButtonPodcast]}
            activeOpacity={0.8}
            disabled={!podcastRessource}
            onPress={() => {
              if (podcastRessource) {
                // @ts-ignore
                if (window && window.open) window.open(podcastRessource.lienR, '_blank');
              }
            }}
          >
            <View style={styles.miniButtonRow}>
              <View style={[styles.mediaIcon, styles.mediaIconPodcast]}>
                <Ionicons name="mic" size={14} color={COULEUR_WHITE} />
              </View>
              <Text style={styles.miniButtonText} numberOfLines={1}>
                {podcastRessource ? podcastRessource.titreR : t('listen_podcast')}
              </Text>
              <View style={[styles.badge, styles.badgePodcast]}>
                <Text style={styles.badgeText}>{t('home_podcast_badge')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </View>
          </TouchableOpacity>
        </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  mascotContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  sparkleTop: {
    position: 'absolute',
    top: -5,
    right: -10,
    zIndex: 1,
  },
  logoImage: {
    width: 135,
    height: 135,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COULEUR_WHITE,
    marginTop: 12,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 12,
  },
  datePillText: {
    color: COULEUR_WHITE,
    fontSize: 13,
    fontWeight: '600',
  },
  // Content Section
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Hero Card
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#0F2E5A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  heroIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
  },
  // Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COULEUR_WHITE,
    marginBottom: 14,
  },
  // Grid
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  // Action Cards
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  actionCardPrimary: {
    backgroundColor: '#2E7CF6',
  },
  actionCardSecondary: {
    backgroundColor: '#6b4EFF',
  },
  actionCardDisabled: {
    opacity: 0.5,
  },
  actionCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardTitle: {
    color: COULEUR_WHITE,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  actionCardSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    lineHeight: 16,
  },
  // Mini Buttons
  miniButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#0F2E5A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  miniButtonVideo: {
    borderLeftWidth: 3,
    borderLeftColor: COULEUR_YOUTUBE,
  },
  miniButtonPodcast: {
    borderLeftWidth: 3,
    borderLeftColor: '#8B7EC8',
  },
  miniButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mediaIcon: {
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaIconVideo: {
    backgroundColor: COULEUR_YOUTUBE,
  },
  mediaIconPodcast: {
    backgroundColor: '#8B7EC8',
  },
  miniButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COULEUR_TEXT_DARK,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeVideo: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  badgePodcast: {
    backgroundColor: 'rgba(139, 126, 200, 0.15)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
  },
});

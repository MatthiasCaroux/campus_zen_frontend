import React, { use, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Professionnel from '../types/Professionnel';
import { proDetailsStyles } from '../screenStyles/ProDetailsStyle';
import { getProfessionnelsById } from '../services/ProfessionnelProvider';
import { Ionicons } from '@expo/vector-icons';

type ProDetailsRouteProp = RouteProp<{ ProDetails: { proId: number } }, 'ProDetails'>;

export default function ProDetailsScreen() {
  // details d un professionnel
  const route = useRoute<ProDetailsRouteProp>();
  const navigation = useNavigation();
  const proId = route.params.proId;

  const [professionnel, setProfessionnel] = useState<Professionnel | null>(null);

  useEffect(() => {
    async function fetchProfessionnel() {
      try {
        // recupere le pro par id depuis l api
        const data = await getProfessionnelsById(proId);
        setProfessionnel(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du professionnel :", error);
      }
    }
    fetchProfessionnel();
  }, [proId]);

  if (!professionnel) {
    return (
      <View style={proDetailsStyles.loadingContainer}>
        <Text style={proDetailsStyles.loadingText}>Chargement des détails...</Text>
      </View>
    );
  }

  const handleCall = (phone: string) => {
    // ouvre l appli telephone
    const phoneNumber = Platform.OS === 'ios' ? `telprompt:${phone}` : `tel:${phone}`;
    Linking.openURL(phoneNumber);
  };

  const handleEmail = (email: string) => {
    // ouvre le client mail
    Linking.openURL(`mailto:${email}`);
  };

  const handleOpenMap = () => {
    // ouvre maps selon la plateforme
    if (professionnel.lat && professionnel.long) {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q='
      });
      const latLng = `${professionnel.lat},${professionnel.long}`;
      const label = professionnel.fonctionPro;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
        web: `https://www.google.com/maps/search/?api=1&query=${latLng}`
      });
      
      if (url) {
        Linking.openURL(url);
      }
    }
  };

  return (
    <View style={proDetailsStyles.container}>
      {/* header */}
      <View style={proDetailsStyles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={proDetailsStyles.scrollView} contentContainerStyle={proDetailsStyles.scrollContent}>
        {/* section principale */}
        <View style={proDetailsStyles.mainCard}>
          <Text style={proDetailsStyles.fonction}>{professionnel.fonctionPro}</Text>
        </View>

        {/* section infos */}
        <View style={proDetailsStyles.section}>
          <Text style={proDetailsStyles.sectionTitle}>😊 Informations </Text>
          <View style={proDetailsStyles.infoCard}>
            <Text style={proDetailsStyles.infoLabel}>Nom</Text>
            <Text style={proDetailsStyles.infoValue}>{professionnel.nomPro || 'Non renseignée'}</Text>
            
            <View style={proDetailsStyles.divider} />
            
            <Text style={proDetailsStyles.infoLabel}>Prénom</Text>
            <Text style={proDetailsStyles.infoValue}>{professionnel.prenomPro || 'Non renseignée'}</Text>

            <View style={proDetailsStyles.divider} />

            <Text style={proDetailsStyles.infoLabel}>Fonction</Text>
              <Text style={proDetailsStyles.infoValue}>{professionnel.fonctionPro}</Text>
          </View>
        </View>

        {/* section contact */}
        {(professionnel.telephonePro || professionnel.emailPro) && (
          <View style={proDetailsStyles.section}>
            <Text style={proDetailsStyles.sectionTitle}>📞 Contact</Text>
            <View style={proDetailsStyles.infoCard}>
              {professionnel.telephonePro && (
                <>
                  <Text style={proDetailsStyles.infoLabel}>Téléphone</Text>
                  <Text style={proDetailsStyles.infoValue}>{professionnel.telephonePro}</Text>
                  <TouchableOpacity 
                    style={proDetailsStyles.actionButton}
                    onPress={() => handleCall(professionnel.telephonePro!)}
                  >
                    <Text style={proDetailsStyles.actionButtonText}>📱 Appeler</Text>
                  </TouchableOpacity>
                </>
              )}
              
              {professionnel.emailPro && (
                <>
                  {professionnel.telephonePro && <View style={proDetailsStyles.divider} />}
                  <Text style={proDetailsStyles.infoLabel}>Email</Text>
                  <Text style={proDetailsStyles.infoValue}>{professionnel.emailPro}</Text>
                  <TouchableOpacity 
                    style={proDetailsStyles.actionButton}
                    onPress={() => handleEmail(professionnel.emailPro!)}
                  >
                    <Text style={proDetailsStyles.actionButtonText}>✉️ Envoyer un email</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}

        {/* section localisation */}
        <View style={proDetailsStyles.section}>
          <Text style={proDetailsStyles.sectionTitle}>📍 Localisation</Text>
          <View style={proDetailsStyles.infoCard}>
            <Text style={proDetailsStyles.infoLabel}>Adresse</Text>
            <Text style={proDetailsStyles.infoValue}>{professionnel.adressePro || 'Non renseignée'}</Text>
            
            {professionnel.lat && professionnel.long && (
              <>
                <View style={proDetailsStyles.divider} />
                <Text style={proDetailsStyles.infoLabel}>Coordonnées GPS</Text>
                <Text style={proDetailsStyles.infoValue}>
                  Lat: {professionnel.lat.toFixed(6)}, Long: {professionnel.long.toFixed(6)}
                </Text>
                
                <TouchableOpacity 
                  style={proDetailsStyles.actionButton}
                  onPress={handleOpenMap}
                >
                  <Text style={proDetailsStyles.actionButtonText}>🗺️ Ouvrir dans Maps</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
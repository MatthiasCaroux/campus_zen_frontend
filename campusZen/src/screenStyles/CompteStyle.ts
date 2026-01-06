import { StyleSheet } from "react-native";
import * as colors from '../theme/colors';

export const compteStyles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.COULEUR_WHITE,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: colors.COULEUR_WHITE,
    opacity: 0.9,
  },
  card: {
    width: "100%",
    backgroundColor: colors.COULEUR_WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: colors.COULEUR_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.COULEUR_TEXT_DARK,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  label: {
    fontSize: 13,
    color: colors.COULEUR_SOUS_TITRE,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.COULEUR_TEXT_DARK,
  },
  logoutButton: {
    backgroundColor: colors.COULEUR_BOUTON,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.COULEUR_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },
  logoutButtonText: {
    color: colors.COULEUR_WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: colors.COULEUR_WHITE,
    marginTop: 10,
    fontSize: 16,
  },
  noUser: {
    color: colors.COULEUR_WHITE,
    fontSize: 16,
    textAlign: "center",
  },
});


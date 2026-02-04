import { StyleSheet, Platform } from 'react-native';
import { COULEUR_BLEU_FONCE } from '../theme/colors';

export const loginRegisterStyle = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    minHeight: 600,
    justifyContent: "space-between",
  },
  // Logo section (centered vertically in top area)
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COULEUR_BLEU_FONCE,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  // Form section (bottom)
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    shadowColor: "#1a1a1a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
  },
  headerLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COULEUR_BLEU_FONCE,
  },
  // Card container (kept for compatibility, now transparent)
  card: {
    backgroundColor: "transparent",
    padding: 0,
    marginHorizontal: 0,
    marginTop: 0,
  },
  // Mascot area
  mascotContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  logoGlow: {
    backgroundColor: "#ffffff",
    borderRadius: 100,
    padding: 18,
    shadowColor: "#1a1a1a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  mascotImage: {
    width: 180,
    height: 180,
  },
  sparkle: {
    position: "absolute",
    color: "#c4a35a",
  },
  sparkleTop: {
    top: 0,
    right: "30%",
    fontSize: 20,
  },
  sparkleLeft: {
    top: "40%",
    left: "15%",
    fontSize: 16,
  },
  // Title area
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  // Form labels
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  // Input containers
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
  },
  eyeIcon: {
    padding: 5,
  },
  // Password header row
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 13,
    color: COULEUR_BLEU_FONCE,
  },
  // Button
  button: {
    backgroundColor: COULEUR_BLEU_FONCE,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2A5A9A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 8,
  },
  buttonArrow: {
    color: "#fff",
    fontSize: 18,
  },
  // Message
  message: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
  // Register link
  registerText: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    color: COULEUR_BLEU_FONCE,
    fontWeight: "600",
  },
  // Legacy styles kept for compatibility
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  apiStatusContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  apiStatusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 3,
  },
  apiStatusConnected: {
    backgroundColor: "#4CAF50",
  },
  apiStatusError: {
    backgroundColor: "#f44336",
  },
  apiStatusChecking: {
    backgroundColor: "#FFA500",
  },
  apiStatusTextContainer: {
    flex: 1,
    flexDirection: "column",
  },
  apiStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  apiUrlText: {
    fontSize: 10,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginBottom: 2,
  },
  apiDetailsText: {
    fontSize: 10,
    color: "#999",
    fontStyle: "italic",
    marginTop: 2,
  },
});

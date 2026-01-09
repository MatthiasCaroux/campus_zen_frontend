import { StyleSheet, Platform } from 'react-native';

export const loginRegisterStyle = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    minHeight: 600,
  },
  card: {
    backgroundColor: "#fff9e8",
    borderRadius: 15,
    padding: 25,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    color: "#000",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    textAlign: "center",
    marginTop: 10,
  },
  registerText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  registerLink: {
    color: "#007AFF",
    fontWeight: "bold",
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



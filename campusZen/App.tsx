import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";

// composant racine de l app
// on pose les providers ici pour que toute l app y ait acces
export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppNavigator />
      </LanguageProvider>
    </AuthProvider>
  );
}

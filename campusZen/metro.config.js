const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclure les packages web-only du bundle React Native
// Ces packages dépendent du DOM et ne fonctionnent pas sur mobile
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Liste des packages à exclure pour les builds mobiles (Android/iOS)
  const webOnlyPackages = ['leaflet', 'react-leaflet'];

  if (platform !== 'web' && webOnlyPackages.some(pkg => moduleName === pkg || moduleName.startsWith(pkg + '/'))) {
    // Retourner un module vide pour les builds mobiles
    return {
      type: 'empty',
    };
  }

  // Comportement par défaut pour tous les autres modules
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

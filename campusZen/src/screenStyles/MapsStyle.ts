import { StyleSheet, Platform } from 'react-native';
import { COULEUR_FOND_BLEU } from '../theme/colors';

export const mapStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COULEUR_FOND_BLEU,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  container: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    flex: Platform.OS === 'web' ? 2 : 1,
    minHeight: Platform.OS === 'web' ? '100%' : 300,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderTopWidth: Platform.OS === 'web' ? 0 : 1,
    borderColor: '#e0e0e0',
  },
  listHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: COULEUR_FOND_BLEU,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
  },
    proCard: {
    margin: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  proCardSelected: {
    backgroundColor: '#e8f3ff',
    borderColor: COULEUR_FOND_BLEU,
    borderWidth: 2,
  },
  proHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  proFonction: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  proAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  selectedIndicator: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectedText: {
    fontSize: 12,
    color: COULEUR_FOND_BLEU,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  floatingHeader: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  floatingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  floatingCount: {
    marginTop: 2,
    fontSize: 14,
    color: '#555',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionTitle: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    opacity: 0.8,
  },
  proCardWrapper: {
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginHorizontal: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});


import { StyleSheet, Platform, StatusBar } from "react-native";

export const ressourcesStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#fff',
    },

    container: {
        padding: 20,
        gap: 20,
        alignItems: "stretch",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#3366FF",
    },

    // 🔍 SEARCH BAR
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        flexShrink: 1,
        minWidth: 0,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 14,
        gap: 10,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },

    titlePage: {
        fontSize: 22,
        fontWeight: "700",
        color: "#222",
    },

    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        gap: 12,
    },

    addButton: {
        flexShrink: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    // 🎛️ FILTERS
    filterScroll: {
        width: "100%",
        maxHeight: 50,
    },

    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: "#eee",
        borderRadius: 20,
        marginRight: 10,
    },

    filterChipActive: {
        backgroundColor: "#3366FF",
    },

    filterText: {
        color: "#444",
        fontWeight: "500",
    },

    filterTextActive: {
        color: "#fff",
        fontWeight: "600",
    },

    // 🃏 CARDS
    card: {
        width: "100%",
        maxWidth: 500,
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 20,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 5,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 8,
    },

    type: {
        fontSize: 14,
        fontWeight: "600",
        color: "#3366FF",
        letterSpacing: 1,
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 6,
        color: "#222",
    },

    description: {
        fontSize: 16,
        color: "#555",
        marginBottom: 15,
        lineHeight: 22,
    },

    linkRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    editLink: {
        fontSize: 16,
        fontWeight: "600",
        color: "#3366FF",
        /* color: "#FF8800",*/
        marginLeft: 15,
    },

    link: {
        fontSize: 16,
        fontWeight: "600",
        color: "#3366FF",
        marginTop: 5,
    },

    emptyText: {
        marginTop: 20,
        fontSize: 16,
        color: "#777",
        fontStyle: "italic",
    },
});

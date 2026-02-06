import { StyleSheet } from "react-native";

export const ressourcesFormStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    loadingText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#3366FF"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        gap: 15
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#222"
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100
    },
    section: {
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8
    },
    input: {
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        padding: 12,
        fontSize: 16
    },
    textarea: {
        height: 120,
        textAlignVertical: "top"
    },
    buttonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#3366FF",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginRight: 10,
    },
    saveText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700"
    },
    deleteButton: {
        flex: 1,
        backgroundColor: "#ff4444",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
    },
    deleteText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700"
    },
    typeChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#eee",
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 5,

    },
    typeChipActive: {
        backgroundColor: "#3366FF"
    },
    typeText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#444"
    },
});


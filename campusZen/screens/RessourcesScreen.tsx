import React, { useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRessources } from "../hooks/useRessources";
import { ressourcesStyles } from "../src/screenStyles/RessourcesStyle";
import { getStoredUser } from "../services/AuthService";
import { useNavigation } from "@react-navigation/native";

const FILTERS = [
    { value: "all", label: "Tout" },
    { value: "article", label: "Articles" },
    { value: "video", label: "Vidéos" },
    { value: "podcast", label: "Podcasts" },
    { value: "livre", label: "Livres" },
    { value: "site_web", label: "Sites web" },
    { value: "documentaire", label: "Documentaires" },
    { value: "film", label: "Films" },
    { value: "formation", label: "Formations" },
];

export default function RessourcesScreen() {
    const { ressources, loading } = useRessources();
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [user, setUser] = useState<any>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getStoredUser();
            if (userData) {
                setUser(userData);
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case "article": return "document-text-outline";
            case "video": return "play-circle-outline";
            case "podcast": return "mic-outline";
            case "livre": return "book-outline";
            case "site_web": return "globe-outline";
            case "documentaire": return "film-outline";
            case "film": return "videocam-outline";
            case "formation": return "school-outline";
            default: return "cube-outline";
        }
    };

    const filteredData = useMemo(() => {
        return ressources.filter(r => {
            const matchSearch =
                r.titreR.toLowerCase().includes(search.toLowerCase()) ||
                r.descriptionR.toLowerCase().includes(search.toLowerCase());

            const matchFilter =
                activeFilter === "all" || r.typeR === activeFilter;

            return matchSearch && matchFilter;
        });
    }, [ressources, search, activeFilter]);

    if (loading) {
        return (
            <View style={ressourcesStyles.loadingContainer}>
                <Text style={ressourcesStyles.loadingText}>Chargement des ressources...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={ressourcesStyles.container}>

            <View style={ressourcesStyles.searchRow}>

                {/* BARRE DE RECHERCHE */}
                <View style={ressourcesStyles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#666" />
                    <TextInput
                        style={ressourcesStyles.searchInput}
                        placeholder="Rechercher une ressource..."
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor="#999"
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                {user && user.role === "admin" && (
                    <TouchableOpacity
                        style={ressourcesStyles.addButton}
                        onPress={() => navigation.navigate("RessourceForm")}
                    >
                        <Ionicons name="add-circle-outline" size={32} color="#3366FF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* FILTRES */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ressourcesStyles.filterScroll}>
                {FILTERS.map(f => (
                    <TouchableOpacity
                        key={f.value}
                        style={[
                            ressourcesStyles.filterChip,
                            activeFilter === f.value && ressourcesStyles.filterChipActive
                        ]}
                        onPress={() => setActiveFilter(f.value)}
                    >
                        <Text style={[
                            ressourcesStyles.filterText,
                            activeFilter === f.value && ressourcesStyles.filterTextActive
                        ]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* RESSOURCES */}
            {ressources.length === 0 ? (
                <Text style={ressourcesStyles.emptyText}>Aucune ressource disponible pour le moment.</Text>
            )
            : filteredData.map((ressource) => (
                <View key={ressource.idR} style={ressourcesStyles.card}>

                    <View style={ressourcesStyles.headerRow}>
                        <Ionicons
                            name={getIcon(ressource.typeR)}
                            size={28}
                            color="#3366FF"
                        />
                        <Text style={ressourcesStyles.type}>{ressource.typeR.toUpperCase()}</Text>
                    </View>

                    <Text style={ressourcesStyles.title}>{ressource.titreR}</Text>
                    <Text style={ressourcesStyles.description}>{ressource.descriptionR}</Text>

                    <View style={ressourcesStyles.linkRow}>
                        <TouchableOpacity onPress={() => Linking.openURL(ressource.lienR)}>
                            <Text style={ressourcesStyles.link}>Voir la ressource →</Text>
                        </TouchableOpacity>

                        {user && user.role === "admin" && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("RessourceForm", { ressourceId: ressource.idR })}
                            >
                                <Text style={ressourcesStyles.editLink}>
                                    <Ionicons name="create-outline" size={22}/>
                                    Modifier
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ))}

            {filteredData.length === 0 && ressources.length != 0 && (
                <Text style={ressourcesStyles.emptyText}>Aucune ressource ne correspond à votre recherche.</Text>
            )}
        </ScrollView>
    );
}

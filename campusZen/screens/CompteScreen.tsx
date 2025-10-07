import React from "react";
import { View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CompteScreen({ navigation }: any) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Se déconnecter" onPress={handleLogout} />
    </View>
  );
}

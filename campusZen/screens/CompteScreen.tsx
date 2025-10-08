import React, { useContext } from "react";
import { View, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function CompteScreen() {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Se déconnecter" onPress={logout} />
    </View>
  );
}

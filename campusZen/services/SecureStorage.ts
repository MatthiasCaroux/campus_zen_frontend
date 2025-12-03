import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { deleteTokenWebSafe, getTokenWebSafe, saveTokenWebSafe } from "./SecureStorageWeb";

const isWeb = Platform.OS === "web";

export async function saveTokens(accessToken: string, refreshToken: string) {
    if (isWeb) {
        await saveTokenWebSafe("accessToken", accessToken);
        await saveTokenWebSafe("refreshToken", refreshToken);
    } else {
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
    }
}

export async function getTokens() {
    if (isWeb) {
        const accessToken = await getTokenWebSafe("accessToken");
        const refreshToken = await getTokenWebSafe("refreshToken");
        return { accessToken, refreshToken };
    } else {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        return { accessToken, refreshToken };
    }
}

export async function deleteTokens() {
    if (isWeb) {
        await deleteTokenWebSafe("accessToken");
        await deleteTokenWebSafe("refreshToken");
    } else {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
    }
}

export async function getAccessToken() {
    if (isWeb) {
        return await getTokenWebSafe("accessToken");
    }
    return SecureStore.getItemAsync("accessToken");
}

export async function getRefreshToken() {
    if (isWeb) {
        return await getTokenWebSafe("refreshToken");
    }
    return await SecureStore.getItemAsync("refreshToken");
}

export async function setAccessToken(newAccessToken: string) {
    if (isWeb) {
        await saveTokenWebSafe("accessToken", newAccessToken);
    } else {
        await SecureStore.setItemAsync("accessToken", newAccessToken);
    }
}

export async function setRefreshToken(newRefreshToken: string) {
    if (isWeb) {
        await saveTokenWebSafe("refreshToken", newRefreshToken);
    } else {
        await SecureStore.setItemAsync("refreshToken", newRefreshToken);
    }
}





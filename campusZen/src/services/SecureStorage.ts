import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { deleteCookie, getCookie, saveCookie } from "./SecureStorageWeb";

const isWeb = Platform.OS === "web";

export async function saveTokens(accessToken: string, refreshToken: string) {
    if (isWeb) {
        // sur web, les tokens sont gérés par des HttpOnly cookies (backend)
        // pas besoin de les stocker manuellement
        return;
    } else {
        // sur mobile on stocke dans secure store
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
    }
}

export async function getTokens() {
    if (isWeb) {
        // sur web, tokens dans HttpOnly cookies (non accessibles en JS)
        return { accessToken: null, refreshToken: null };
    } else {
        // secure store cote mobile
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        return { accessToken, refreshToken };
    }
}

export async function deleteTokens() {
    if (isWeb) {
        // sur web, appeler /logout pour supprimer les HttpOnly cookies
        return;
    } else {
        // suppression secure store
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
    }
}

export async function getAccessToken() {
    if (isWeb) {
        // tokens dans HttpOnly cookies (gérés automatiquement)
        return null;
    }
    return SecureStore.getItemAsync("accessToken");
}

export async function getRefreshToken() {
    if (isWeb) {
        // tokens dans HttpOnly cookies (gérés automatiquement)
        return null;
    }
    return await SecureStore.getItemAsync("refreshToken");
}

export async function setAccessToken(newAccessToken: string) {
    if (isWeb) {
        // tokens gérés par HttpOnly cookies backend
        return;
    } else {
        await SecureStore.setItemAsync("accessToken", newAccessToken);
    }
}

export async function setRefreshToken(newRefreshToken: string) {
    if (isWeb) {
        // tokens gérés par HttpOnly cookies backend
        return;
    } else {
        await SecureStore.setItemAsync("refreshToken", newRefreshToken);
    }
}





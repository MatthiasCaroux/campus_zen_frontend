import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { deleteCookie, getCookie, saveCookie } from "./SecureStorageWeb";

const isWeb = Platform.OS === "web";

export async function saveTokens(accessToken: string, refreshToken: string) {
    if (isWeb) {
        // sur web on stocke en cookies
        saveCookie("accessToken", accessToken);
        saveCookie("refreshToken", refreshToken);
    } else {
        // sur mobile on stocke dans secure store
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
    }
}

export async function getTokens() {
    if (isWeb) {
        // cookies cote web
        const accessToken = getCookie("accessToken");
        const refreshToken = getCookie("refreshToken");
        return { accessToken, refreshToken };
    } else {
        // secure store cote mobile
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        return { accessToken, refreshToken };
    }
}

export async function deleteTokens() {
    if (isWeb) {
        // suppression cookies
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
    } else {
        // suppression secure store
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
    }
}

export async function getAccessToken() {
    if (isWeb) {
        return getCookie("accessToken");
    }
    return SecureStore.getItemAsync("accessToken");
}

export async function getRefreshToken() {
    if (isWeb) {
        return getCookie("refreshToken");
    }
    return await SecureStore.getItemAsync("refreshToken");
}

export async function setAccessToken(newAccessToken: string) {
    if (isWeb) {
        saveCookie("accessToken", newAccessToken);
    } else {
        await SecureStore.setItemAsync("accessToken", newAccessToken);
    }
}

export async function setRefreshToken(newRefreshToken: string) {
    if (isWeb) {
        saveCookie("refreshToken", newRefreshToken);
    } else {
        await SecureStore.setItemAsync("refreshToken", newRefreshToken);
    }
}





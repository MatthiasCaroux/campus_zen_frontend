import * as SecureStore from "expo-secure-store";

export async function saveTokens(accessToken: string, refreshToken: string) {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
}

export async function getTokens() {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    return { accessToken, refreshToken };
}

export async function deleteTokens() {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
}

export async function getAccessToken() {
    return SecureStore.getItemAsync("accessToken");
}

export async function getRefreshToken() {
    return await SecureStore.getItemAsync("refreshToken");
}

export async function setAccessToken(newAccessToken: string) {
    await SecureStore.setItemAsync("accessToken", newAccessToken);
}

export async function setRefreshToken(newRefreshToken: string) {
    await SecureStore.setItemAsync("refreshToken", newRefreshToken);
}





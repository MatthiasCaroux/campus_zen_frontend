import * as SecureStore from "expo-secure-store";

export async function saveTokenWebSafe(key: string, value: string) {
  if (typeof window === "undefined") return;

  document.cookie = `${key}=${value}; path=/; sameSite=strict; secure;`;
}

export async function getTokenWebSafe(key: string) {
  if (typeof window === "undefined") return null;

  const entry = document.cookie.split("; ").find(row => row.startsWith(key + "="));
  return entry ? entry.split("=")[1] : null;
}

export async function deleteTokenWebSafe(key: string) {
  if (typeof window === "undefined") return;

  document.cookie = `${key}=; path=/; max-age=0;`;
}


// helper cookies pour la version web
// en theorie sameSite strict limite les risques csrf
export function saveCookie(key: string, value: string) {
  if (typeof document === "undefined") return;

  document.cookie = `${key}=${value}; path=/; secure; samesite=strict`;
}

export function getCookie(key: string) {
  if (typeof document === "undefined") return null;

  const entry = document.cookie
    .split("; ")
    .find((row) => row.startsWith(key + "="));

  return entry ? entry.split("=")[1] : null;
}

export function deleteCookie(key: string) {
  if (typeof document === "undefined") return;

  document.cookie = `${key}=; path=/; max-age=0`;
}


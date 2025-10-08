import axios from "axios";

const API_URL = "https://campuszenbackend-production.up.railway.app/api/"; 

export const register = async (emailPers: string, passwordPers: string) => {
  try {
    const response = await axios.post(`${API_URL}register/`, {
      emailPers,
      passwordPers,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur inscription:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (emailPers: string, passwordPers: string) => {
  try {
    const response = await axios.post(`${API_URL}login/`, {
      emailPers,
      passwordPers,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur connexion:", error.response?.data || error.message);
    throw error;
  }
};

export async function getProfile(token: string) {
  const response = await axios.get(`${API_URL}/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export async function changePassword(token: string, oldPassword: string, newPassword: string) {
  const response = await axios.post(
    `${API_URL}/change-password/`,
    { old_password: oldPassword, new_password: newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};



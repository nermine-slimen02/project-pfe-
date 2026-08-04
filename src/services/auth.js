import api from './api';

export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", response.data);

    return response.data;

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    throw error;
  }
}
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração da API
const api = axios.create({
  // IMPORTANTE: Substitua pelo IP da sua máquina local
  // Para encontrar o IP: Windows (ipconfig), Mac/Linux (ifconfig ou ip a)
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      try {
        await AsyncStorage.removeItem('userToken');
        // Aqui você pode redirecionar para login se necessário
      } catch (e) {
        console.error('Erro ao remover token:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;


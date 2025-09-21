import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração da API para XAMPP
const api = axios.create({
  // XAMPP geralmente roda na porta 80, mas o Laravel Artisan serve na 8000
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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
        console.log('Token removido - usuário deslogado');
      } catch (e) {
        console.error('Erro ao remover token:', e);
      }
    }
    
    // Log detalhado para debug
    console.error('Erro na API:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

export default api;


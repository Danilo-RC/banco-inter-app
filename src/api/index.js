import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração da API para IP local com XAMPP
const api = axios.create({
  // da pra colocar no celular se estiver na mesma rede e com o IP da máquina mas coloque o comando no laravel: php artisan serve --host=0.0.0.0 --port=8000
  baseURL: "http://192.168.15.14:8000/api", //está configurado para o ip do meu pc (Danilo) mas coloque o IP da sua máquina
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro ao obter token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar as respostas e ele funciona para logout automático se o token expirar
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token foi expirado ou inválido
      try {
        await AsyncStorage.removeItem("userToken");
      } catch (e) {
        console.error("Erro ao remover token:", e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

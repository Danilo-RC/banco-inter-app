import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import styles from "./style";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: email,
        password: senha,
      });

      if (response.status === 200) {
        // Salva o token no AsyncStorage
        await AsyncStorage.setItem("userToken", response.data.token);

        Alert.alert("Sucesso", "Login realizado com sucesso!");

        // Navega para Home com dados do usuário
        navigation.replace("Home", {
          user: response.data.user,
        });
      }
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error);

      let errorMessage = "Erro no login. Tente novamente.";

      if (error.response?.status === 401) {
        errorMessage = "Email ou senha incorretos.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Banco Inter</Text>
      <Text style={styles.subtitle}>Faça seu login</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!loading}
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Cadastro")}
        disabled={loading}
      >
        <Text style={styles.registerLink}>Criar uma conta</Text>
      </Pressable>
    </View>
  );
}

import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../api";
import styles from "./style";

export default function Cadastro() {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const validarCampos = () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "Digite seu nome completo.");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Erro", "Digite seu email.");
      return false;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Digite um email válido.");
      return false;
    }

    if (!senha) {
      Alert.alert("Erro", "Digite uma senha.");
      return false;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return false;
    }

    return true;
  };

  const handleCadastro = async () => {
    if (!validarCampos()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/register", {
        name: nome.trim(),
        email: email.trim().toLowerCase(),
        password: senha,
      });

      if (response.status === 201) {
        Alert.alert(
          "Sucesso", 
          "Conta criada com sucesso! Faça login para continuar.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login")
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error);
      
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      
      if (error.response?.status === 422) {
        // Erro de validação
        const errors = error.response.data.errors;
        if (errors?.email) {
          errorMessage = "Este email já está em uso.";
        } else if (errors?.password) {
          errorMessage = "A senha deve ter pelo menos 6 caracteres.";
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Banco Inter</Text>
      <Text style={styles.subtitle}>Criar nova conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha (mínimo 6 caracteres)"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        editable={!loading}
      />

      <Pressable 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleCadastro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Criar Conta</Text>
        )}
      </Pressable>

      <Pressable 
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.backLink}>Já tenho uma conta</Text>
      </Pressable>
    </ScrollView>
  );
}


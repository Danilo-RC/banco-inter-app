import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import api from "../../api";
import styles from "./style";

export default function Perfil() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Carregar dados do usuário
  const loadUserData = async () => {
    try {
      const response = await api.get("/user");
      if (response.status === 200) {
        const userData = response.data.user || response.data;
        setUser(userData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);

      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("userToken");
        navigation.replace("Login");
      } else {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Pedir permissões
  const requestPermissions = async () => {
    if (Platform.OS === "web") return true; // web não precisa de permissão

    const camera = await ImagePicker.requestCameraPermissionsAsync();
    const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (camera.status !== "granted" || gallery.status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "É necessário permitir acesso à câmera e galeria."
      );
      return false;
    }
    return true;
  };

  // Tirar foto
  const takePhoto = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Indisponível", "Câmera não funciona na web.");
      return;
    }

    const ok = await requestPermissions();
    if (!ok) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadPhoto(result.assets[0].uri);
    }
  };

  // Escolher da galeria
  const pickFromGallery = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uri = URL.createObjectURL(file);
        await uploadPhoto(uri);
      };
      input.click();
      return;
    }

    const ok = await requestPermissions();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadPhoto(result.assets[0].uri);
    }
  };

  // Upload da foto
  const uploadPhoto = async (uri) => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();

      // Para web, precisa transformar em File
      if (Platform.OS === "web") {
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], "photo.jpg", { type: blob.type });
        formData.append("photo", file);
      } else {
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        formData.append("photo", { uri, type, name: filename });
      }

      const response = await api.post("/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        Alert.alert("Sucesso", "Foto atualizada com sucesso!");
        await loadUserData();
      }
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      Alert.alert("Erro", "Não foi possível atualizar a foto.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Logout
  const handleLogout = () => {
    Alert.alert("Sair da Conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await api.post("/logout");
          } catch (error) {
            console.error("Erro no logout:", error);
          } finally {
            await AsyncStorage.removeItem("userToken");
            navigation.replace("Login");
          }
        },
      },
    ]);
  };

  // Formatar valor como moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Foto de Perfil */}
      <View style={styles.photoContainer}>
        {user?.foto_perfil ? (
          <Image
            source={{
              uri: `${api.defaults.baseURL.replace("/api", "")}/storage/${
                user.foto_perfil
              }`,
            }}
            style={styles.profilePhoto}
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>Foto</Text>
          </View>
        )}

        <View style={styles.photoButtons}>
          <Pressable
            style={styles.changePhotoButton}
            onPress={takePhoto}
            disabled={uploadingPhoto}
          >
            <Text style={styles.changePhotoText}>📷 Câmera</Text>
          </Pressable>

          <Pressable
            style={styles.changePhotoButton}
            onPress={pickFromGallery}
            disabled={uploadingPhoto}
          >
            <Text style={styles.changePhotoText}>🖼️ Galeria</Text>
          </Pressable>
        </View>

        {uploadingPhoto && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </View>

      {/* Informações do Usuário */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{user?.name || "Não informado"}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email || "Não informado"}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Saldo:</Text>
          <Text style={styles.infoValue}>{formatCurrency(user?.saldo)}</Text>
        </View>
      </View>

      {/* Botão de Logout */}
      <View style={styles.logoutContainer}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

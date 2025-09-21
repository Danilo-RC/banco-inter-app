import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
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
      const response = await api.get('/user');
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      
      if (error.response?.status === 401) {
        // Token inválido, redirecionar para login
        await AsyncStorage.removeItem('userToken');
        navigation.replace('Login');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Solicitar permissões para câmera e galeria
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissões necessárias',
        'Precisamos de acesso à câmera e galeria para alterar sua foto de perfil.'
      );
      return false;
    }
    
    return true;
  };

  // Escolher foto
  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    Alert.alert(
      'Escolher Foto',
      'Como você gostaria de adicionar sua foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Câmera', onPress: () => openCamera() },
        { text: 'Galeria', onPress: () => openGallery() },
      ]
    );
  };

  // Abrir câmera
  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao abrir câmera:', error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  // Abrir galeria
  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao abrir galeria:', error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  // Upload da foto
  const uploadPhoto = async (uri) => {
    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      
      // Criar objeto de arquivo para upload
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('photo', {
        uri: uri,
        type: type,
        name: filename,
      });

      const response = await api.post('/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
        // Recarregar dados do usuário para mostrar a nova foto
        await loadUserData();
      }
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      
      let errorMessage = 'Não foi possível atualizar a foto.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Logout
  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              // Chamar API de logout
              await api.post('/logout');
            } catch (error) {
              console.error('Erro no logout:', error);
            } finally {
              // Remover token e navegar para login
              await AsyncStorage.removeItem('userToken');
              navigation.replace('Login');
            }
          },
        },
      ]
    );
  };

  // Formatar valor como moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  // Formatar data de registro
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
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
        <Pressable
          style={styles.photoWrapper}
          onPress={pickImage}
          disabled={uploadingPhoto}
        >
          {user?.foto_perfil ? (
            <Image
              source={{ uri: user.foto_perfil }}
              style={styles.profilePhoto}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {uploadingPhoto ? '...' : 'Foto'}
              </Text>
            </View>
          )}
          
          {uploadingPhoto && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </Pressable>
        
        <Pressable
          style={styles.changePhotoButton}
          onPress={pickImage}
          disabled={uploadingPhoto}
        >
          <Text style={styles.changePhotoText}>
            {uploadingPhoto ? 'Enviando...' : 'Alterar Foto'}
          </Text>
        </Pressable>
      </View>

      {/* Informações do Usuário */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{user?.name || 'Não informado'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email || 'Não informado'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Saldo:</Text>
          <Text style={styles.infoValue}>{formatCurrency(user?.saldo)}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Membro desde:</Text>
          <Text style={styles.infoValue}>{formatDate(user?.created_at)}</Text>
        </View>
      </View>

      {/* Botão de Logout */}
      <View style={styles.logoutContainer}>
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}


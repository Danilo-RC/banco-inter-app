import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import TransactionModal from "../../components/TransactionModal";
import styles from "./style";

export default function Home({ route }) {
  const navigation = useNavigation();
  const [user, setUser] = useState(route?.params?.user || null);
  const [saldo, setSaldo] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Carregar dados do usuário
  const loadUserData = async () => {
    try {
      const response = await api.get("/user");
      if (response.status === 200) {
        const userData = response.data.user || response.data;
        setUser(userData);
        setSaldo(Number(userData.saldo) || 0);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);

      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("userToken");
        navigation.replace("Login");
      }
    }
  };

  // Carregar transações
  const loadTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      if (response.status === 200) {
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  };

  // Carregar dados iniciais
  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      await Promise.all([loadUserData(), loadTransactions()]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Refresh das transações
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(false);
    setRefreshing(false);
  };

  // Remover transação
  const handleRemoveTransaction = (transactionId) => {
    Alert.alert(
      "Remover Transação",
      "Tem certeza que deseja remover esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await api.delete(
                `/transactions/${transactionId}`
              );
              if (response.status === 200) {
                Alert.alert("Sucesso", "Transação removida com sucesso!");
                await loadData(false);
              }
            } catch (error) {
              console.error("Erro ao remover transação:", error);
              Alert.alert("Erro", "Não foi possível remover a transação.");
            }
          },
        },
      ]
    );
  };

  // Callback quando uma nova transação é criada
  const handleTransactionSuccess = () => {
    loadData(false);
  };

  // Formatar valor como moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Renderizar item da transação
  const renderTransaction = ({ item }) => (
    <Pressable
      style={styles.transactionItem}
      onLongPress={() => handleRemoveTransaction(item.id)}
    >
      <View style={styles.transactionInfo}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionDescription}>{item.descricao}</Text>
          <Text
            style={[
              styles.transactionAmount,
              item.tipo === "entrada" ? styles.entrada : styles.saida,
            ]}
          >
            {item.tipo === "entrada" ? "+" : "-"}{" "}
            {formatCurrency(Number(item.valor))}
          </Text>
        </View>
        <Text style={styles.transactionDate}>
          {formatDate(item.created_at)}
        </Text>
      </View>
    </Pressable>
  );

  // Carregar dados quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Olá, {user?.name?.split(" ")[0] || "Usuário"}!
          </Text>
          <Text style={styles.subtitle}>Bem-vindo ao Banco Inter</Text>
        </View>
        <Pressable
          style={styles.profileButton}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Text style={styles.profileButtonText}>Perfil</Text>
        </Pressable>
      </View>

      {/* Saldo */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo atual</Text>
        <Text style={styles.balanceValue}>{formatCurrency(saldo)}</Text>
      </View>

      {/* Lista de Transações */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.transactionsTitle}>Transações Recentes</Text>

        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para adicionar uma transação
            </Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTransaction}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#FF7A00"]}
                tintColor="#FF7A00"
              />
            }
          />
        )}
      </View>

      {/* FAB - Floating Action Button */}
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* Modal de Transação */}
      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handleTransactionSuccess}
      />
    </View>
  );
}

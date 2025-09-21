import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {user?.name || 'Usuário'}!</Text>
        <Pressable 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Perfil', { user })}
        >
          <Text style={styles.profileButtonText}>Perfil</Text>
        </Pressable>
      </View>

      <View style={styles.saldoContainer}>
        <Text style={styles.saldoLabel}>Saldo atual</Text>
        <Text style={styles.saldoValue}>
          R$ {user?.saldo ? parseFloat(user.saldo).toFixed(2) : '0,00'}
        </Text>
      </View>

      <View style={styles.transactionsContainer}>
        <Text style={styles.transactionsTitle}>Transações Recentes</Text>
        <Text style={styles.emptyMessage}>
          Nenhuma transação encontrada
        </Text>
      </View>

      <View style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FF7A00',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saldoContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saldoLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  saldoValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#FF7A00',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});


import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import api from "../api";

export default function TransactionModal({ visible, onClose, onSuccess }) {
  const [tipo, setTipo] = useState(""); // 'entrada' ou 'saida'
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTipo("");
    setValor("");
    setDescricao("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatarValor = (text) => {
    const numeros = text.replace(/[^0-9]/g, "");
    if (numeros === "") return "";
    const valor = parseInt(numeros) / 100;
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleValorChange = (text) => {
    setValor(formatarValor(text));
  };

  const validarCampos = () => {
    if (!tipo) {
      Alert.alert("Erro", "Selecione o tipo da transação.");
      return false;
    }
    if (!valor || valor === "0,00") {
      Alert.alert("Erro", "Digite um valor válido.");
      return false;
    }
    if (!descricao.trim()) {
      Alert.alert("Erro", "Digite uma descrição para a transação.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    try {
      const valorNumerico = parseFloat(
        valor.replace(/\./g, "").replace(",", ".")
      );
      const response = await api.post("/transactions", {
        type: tipo,
        amount: valorNumerico,
        description: descricao.trim(),
      });

      if (response.status === 201) {
        Alert.alert("Sucesso", "Transação criada com sucesso!");
        onSuccess();
        handleClose();
      }
    } catch (error) {
      console.error("Erro ao criar transação:", error.response?.data || error);
      let errorMessage = "Erro ao criar transação. Tente novamente.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Nova Transação</Text>

          {/* Seleção do tipo */}
          <View style={styles.typeContainer}>
            <Pressable
              style={[
                styles.typeButton,
                tipo === "entrada" && { backgroundColor: "#28a745" },
              ]}
              onPress={() => setTipo("entrada")}
              disabled={loading}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  tipo === "entrada" && { color: "#fff" },
                ]}
              >
                ↑ Entrada
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.typeButton,
                tipo === "saida" && { backgroundColor: "#dc3545" },
              ]}
              onPress={() => setTipo("saida")}
              disabled={loading}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  tipo === "saida" && { color: "#fff" },
                ]}
              >
                ↓ Saída
              </Text>
            </Pressable>
          </View>

          {/* Campo de valor */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor</Text>
            <View style={styles.valorContainer}>
              <Text style={styles.moedaSymbol}>R$</Text>
              <TextInput
                style={styles.valorInput}
                placeholder="0,00"
                value={valor}
                onChangeText={handleValorChange}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
          </View>

          {/* Campo de descrição */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Salário, Compras, etc."
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={2}
              editable={!loading}
            />
          </View>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.submitButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Salvar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  valorContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  moedaSymbol: {
    fontSize: 18,
    color: "#333",
    marginRight: 10,
  },
  valorInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#FF7A00",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#FFB366",
  },
});

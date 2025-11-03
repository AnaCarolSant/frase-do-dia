import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./src/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [frases, setFrases] = useState<string[]>([]);
  const [fraseAtual, setFraseAtual] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTexto, setNovoTexto] = useState("");

  useEffect(() => {
    carregarFrases();
  }, []);

  async function carregarFrases() {
    try {
      const snapshot = await getDocs(collection(db, "frases"));
      const lista = snapshot.docs.map((doc) => doc.data().texto);
      setFrases(lista);
      if (lista.length > 0) {
        setFraseAtual(lista[Math.floor(Math.random() * lista.length)]);
      }
    } catch (error) {
      console.error("Erro ao carregar frases:", error);
    }
  }

  function novaFrase() {
    if (frases.length > 0) {
      setFraseAtual(frases[Math.floor(Math.random() * frases.length)]);
    }
  }

  async function adicionarFrase() {
    // Alert.prompt funciona apenas no iOS. No Android exibimos um Modal customizado.
    if (Platform.OS === "ios") {
      Alert.prompt("Nova frase", "Digite a nova frase:", async (texto) => {
        if (texto) {
          await addDoc(collection(db, "frases"), { texto });
          Alert.alert("Frase adicionada!");
          carregarFrases();
        }
      });
    } else {
      setNovoTexto("");
      setModalVisible(true);
    }
  }

  async function submitNovoTexto() {
    const texto = novoTexto?.trim();
    if (!texto) {
      Alert.alert("Aviso", "Digite uma frase válida.");
      return;
    }

    try {
      await addDoc(collection(db, "frases"), { texto });
      setModalVisible(false);
      Alert.alert("Frase adicionada!");
      carregarFrases();
    } catch (error) {
      console.error("Erro ao adicionar frase:", error);
      Alert.alert("Erro", "Não foi possível adicionar a frase.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Topo - botão Nova Frase */}
      <View style={styles.topo}>
        <TouchableOpacity onPress={adicionarFrase}>
          <Text style={styles.novaFrase}>Nova frase</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Frase do dia:</Text>
        <Text style={styles.frase}>
          {fraseAtual ? `"${fraseAtual}"` : "Carregando..."}
        </Text>
      </View>


      <TouchableOpacity style={styles.refreshButton} onPress={novaFrase}>
        <Ionicons name="refresh" size={32} color="#f59f00" />
      </TouchableOpacity>
      {/* Modal customizado para Android (prompt) */}
      {Platform.OS !== "ios" && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Nova frase</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a nova frase"
                value={novoTexto}
                onChangeText={setNovoTexto}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={submitNovoTexto}
                >
                  <Text style={[styles.modalButtonText, { fontWeight: "600" }]}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e0c9", 
    justifyContent: "space-between",
  },
  topo: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  novaFrase: {
    color: "#f59f00",
    fontSize: 16,
    fontWeight: "500",
  },
  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 16,
    color: "#9e9e9e",
    marginBottom: 10,
  },
  frase: {
    fontSize: 24,
    fontStyle: "italic",
    textAlign: "center",
    color: "#000",
    lineHeight: 34,
  },
  refreshButton: {
    alignSelf: "center",
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    minHeight: 60,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  modalButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalButtonText: {
    color: "#f59f00",
    fontSize: 16,
  },
});

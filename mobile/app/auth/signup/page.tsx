import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error" | null>(
    null
  );
  const [modalMessage, setModalMessage] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !phone) {
      setModalStatus("error");
      setModalMessage("Semua field harus diisi!");
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://192.168.100.141:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        name,
        email,
        password,
        notelp: phone,
      }),

      });

      const data = await res.json();

      if (res.ok) {
        setModalStatus("success");
        setModalMessage("Pendaftaran berhasil! Silakan login.");
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
          router.push("../login/page");
        }, 1500);
      } else {
        setModalStatus("error");
        setModalMessage(data.message || "Pendaftaran gagal.");
        setModalVisible(true);
      }
    } catch (error) {
      setModalStatus("error");
      setModalMessage("Tidak dapat terhubung ke server.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Buat Akun Baru</Text>
        <Text style={styles.subtitle}>Isi data kamu untuk mendaftar</Text>

        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="LamiGo"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />

        <Text style={styles.label}>Nomor Telepon</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="08xxxxxxxxxx"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Daftar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>atau</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleBtn}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.googleText}>Daftar dengan Google</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Sudah punya akun?{" "}
          <Text
            style={styles.signup}
            onPress={() => router.push("../login/page")}
          >
            Login Sekarang
          </Text>
        </Text>
      </View>

      {/* MODAL */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View
          style={[
            styles.modalBox,
            modalStatus === "success"
              ? { backgroundColor: "#ECFDF5" }
              : { backgroundColor: "#FEF2F2" },
          ]}
        >
          <Ionicons
            name={
              modalStatus === "success"
                ? "checkmark-circle"
                : "close-circle"
            }
            size={60}
            color={modalStatus === "success" ? "#059669" : "#DC2626"}
          />

          <Text
            style={[
              styles.modalTitle,
              modalStatus === "success"
                ? { color: "#059669" }
                : { color: "#DC2626" },
            ]}
          >
            {modalStatus === "success" ? "Berhasil!" : "Gagal!"}
          </Text>

          <Text style={styles.modalMessage}>{modalMessage}</Text>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },

  card: {
    width: "100%",
    maxWidth: 360,
    padding: 25,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  logo: {
    width: 70,
    height: 70,
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937",
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 20,
    fontSize: 13,
  },

  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 14,
    color: "#374151",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#F9FAFB",
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  orText: {
    marginHorizontal: 10,
    color: "#9CA3AF",
    fontSize: 12,
  },

  googleBtn: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  googleText: {
    fontSize: 14,
    color: "#374151",
  },

  footerText: {
    textAlign: "center",
    marginTop: 15,
    color: "#6B7280",
  },
  signup: {
    color: "#2563EB",
    fontWeight: "600",
  },

  modalBox: {
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 5,
  },
});

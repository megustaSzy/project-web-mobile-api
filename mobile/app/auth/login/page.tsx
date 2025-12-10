import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error" | null>(
    null
  );
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setModalStatus("error");
      setModalMessage("Masukkan email dan password!");
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://192.168.100.141:3001/api/auth/login", // ✅ API kamu
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        const token = data.accessToken || data.token;
        if (token) {
          await AsyncStorage.setItem("token", token);
        }

        setModalStatus("success");
        setModalMessage("Login berhasil! Selamat datang 👋");
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
          router.replace("/components/Landingpage"); // ⬅️ Expo Router
        }, 1500);
      } else {
        setModalStatus("error");
        setModalMessage(data.message || "Email atau password salah.");
        setModalVisible(true);
      }
    } catch (err) {
      setModalStatus("error");
      setModalMessage("Tidak dapat terhubung ke server.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Login Akun</Text>
        <Text style={styles.subtitle}>
          Masuk ke akun kamu untuk melanjutkan pemesanan destinasi bersama LamiGo
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => router.push("/auth/forgot-password/page")}
          style={{ alignSelf: "flex-end", marginTop: 5 }}
        >
          <Text style={styles.footerText}>Lupa Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>atau</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleBtn}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.googleText}>Login dengan Google</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Belum punya akun?{" "}
          <Text style={styles.signup} onPress={() => router.push("/auth/signup/page")}>
            Daftar sekarang
          </Text>
        </Text>
      </View>

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
              modalStatus === "success" ? "checkmark-circle" : "close-circle"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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

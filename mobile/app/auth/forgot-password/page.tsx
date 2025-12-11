import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Masukkan email Anda!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Berhasil!", "Link reset password telah dikirim ke email Anda.");
        router.push("../login/page");
      } else {
        Alert.alert("Gagal", data.message || "Email tidak ditemukan.");
      }
    } catch (err) {
      Alert.alert("Error", "Terjadi kesalahan server.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Lupa Password</Text>
        <Text style={styles.subtitle}>
          Masukkan email Anda untuk menerima link reset password
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.button}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF2FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  logo: { width: 70, height: 70, alignSelf: "center", marginBottom: 15 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", color: "#1E293B" },
  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginBottom: 25,
    fontSize: 14,
  },
  label: { fontSize: 14, marginBottom: 5, color: "#334155", fontWeight: "600" },
  input: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});

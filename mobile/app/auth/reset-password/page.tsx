import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

export default function ResetPasswordScreen(props: { route: any; navigation: any; }) {
  const { route, navigation } = props;

  const email = route?.params?.email || "";


  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password.trim() || !confirm.trim()) {
      return Alert.alert("Peringatan", "Semua field wajib diisi.");
    }

    if (password !== confirm) {
      return Alert.alert("Peringatan", "Password tidak sama.");
    }

    setLoading(true);
    try {
      const res = await fetch("http://10.93.86.50:3001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert(
          "Berhasil",
          data.message || "Password berhasil diperbarui.",
          [{ text: "OK", onPress: () => navigation.replace("Login") }]
        );
      } else {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Tidak dapat menghubungi server.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.desc}>
        Buat password baru untuk akun Anda
      </Text>

      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Password baru..."
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Konfirmasi password..."
        placeholderTextColor="#888"
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? "Memproses..." : "Simpan Password Baru"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  desc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});

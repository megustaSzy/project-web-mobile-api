import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const registeredEmails = [
    "test@example.com",
    "faiz@gmail.com",
    "user123@mail.com",
  ];

  const handleSubmit = () => {
    if (!email) {
      Alert.alert("Error", "Masukkan email Anda!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
     if (registeredEmails.includes(email.toLowerCase())) {
             Alert.alert("Berhasil", "Link reset password telah dikirim ke email Anda.");
             router.push("../reset-password/page"); // navigasi ke halaman reset-password
           } else {
        Alert.alert("Email tidak valid", "Email belum terdaftar.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        {/* Logo */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Lupa Password</Text>
        <Text style={styles.subtitle}>
          Masukkan email Anda untuk menerima link reset password
        </Text>

        {/* Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.button}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Memeriksa..." : "Kirim Link Reset"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ====== STYLES ======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: "center",
    marginBottom: 15,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#64748B",
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#334155",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

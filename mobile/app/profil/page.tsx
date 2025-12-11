import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: null as string | null,
  });

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  // Convert image to base64
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPreview(base64Img);
    }
  };

  // Load profile (local first)
  useEffect(() => {
    const loadProfile = async () => {
      const local = await AsyncStorage.getItem("profile");
      const token = await AsyncStorage.getItem("token");

      if (local) {
        const p = JSON.parse(local);
        setUser({
          name: p.name || "Pengguna",
          email: p.email || "",
          avatar: p.avatar || null,
        });
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://10.93.86.50:3001/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const avatarUrl = data.avatar
            ? data.avatar.startsWith("http")
              ? data.avatar
              : `http://10.93.86.50:3001/uploads/${data.avatar}`
            : null;

          setUser({
            name: data.name || "Pengguna",
            email: data.email || "",
            avatar: avatarUrl,
          });
        }
      } catch (err) {
        console.log("Gagal fetch profil", err);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  // Save to local (AsyncStorage)
  const handleSaveLocal = async () => {
    const newProfile = {
      name: user.name || "Pengguna",
      email: user.email || "",
      avatar: preview || user.avatar,
    };

    setUser(newProfile);

    await AsyncStorage.setItem("profile", JSON.stringify(newProfile));
    setPreview(null);

    Alert.alert("Berhasil", "Profil berhasil disimpan secara lokal.");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    // Jika ingin hapus profile:
    // await AsyncStorage.removeItem("profile");
    Alert.alert("Logout", "Anda telah keluar.");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Foto */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Image
          source={{
            uri: preview || user.avatar || "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />

        <TouchableOpacity style={styles.editBtn} onPress={pickImage}>
          <Text style={{ color: "white", fontSize: 18 }}>✎</Text>
        </TouchableOpacity>
      </View>

      {/* Nama */}
      <TextInput
        placeholder="Nama"
        value={user.name}
        onChangeText={(val) => setUser({ ...user, name: val })}
        style={styles.input}
      />

      <Text style={{ color: "#666", marginBottom: 25 }}>{user.email}</Text>

      {preview ? (
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveLocal}>
          <Text style={styles.btnText}>Simpan Foto & Nama (Lokal)</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.saveSecondary} onPress={handleSaveLocal}>
          <Text style={styles.btnText}>Simpan Nama (Lokal)</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop : 100 ,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#93c5fd",
  },
  editBtn: {
    position: "absolute",
    bottom: 0,
    right: 90,
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
  saveSecondary: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginTop: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

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

const API_URL = "http://10.93.86.50:3001"; // SAMAKAN DENGAN WEB

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    avatar: "" as string,
  });

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const buildAvatarUrl = (avatar?: string | null) => {
    if (!avatar) return "https://via.placeholder.com/150";
    return avatar.startsWith("http") ? avatar : `${API_URL}${avatar}`;
  };

  //------------------------------------------------------
  // 🔵 PICK IMAGE
  //------------------------------------------------------
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPreview(asset.uri);
      setFile(asset); // Simpan file asli untuk upload
    }
  };

  //------------------------------------------------------
  // 🔵 FETCH PROFILE (LOCAL FIRST, THEN API)
  //------------------------------------------------------
  useEffect(() => {
    const loadProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      const local = await AsyncStorage.getItem("profile");

      // Jika ada profile lokal → tampilkan dulu
      if (local) {
        const p = JSON.parse(local);
        setUser({
          name: p.name,
          email: p.email,
          role: p.role,
          avatar: buildAvatarUrl(p.avatar),
        });
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (res.ok) {
          const data = json.data;

          const profileData = {
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: buildAvatarUrl(data.avatar),
          };

          setUser(profileData);
          await AsyncStorage.setItem("profile", JSON.stringify(profileData));
        }
      } catch (err) {
        console.log("Error fetch profile:", err);
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  //------------------------------------------------------
  // 🟢 UPDATE PROFILE (PUT /api/users)
  //------------------------------------------------------
  const updateProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return Alert.alert("Error", "Silakan login terlebih dahulu.");

    try {
      const form = new FormData();
      form.append("name", user.name);

      if (file) {
        form.append("avatar", {
          uri: file.uri,
          name: "avatar.jpg",
          type: "image/jpeg",
        } as any);
      }

      const res = await fetch(`${API_URL}/api/users`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: form,
      });

      const json = await res.json();

      if (!res.ok) {
        console.log(json);
        return Alert.alert("Gagal", "Tidak bisa update profil.");
      }

      const data = json.data;

      const newProfile = {
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: buildAvatarUrl(data.avatar),
      };

      setUser(newProfile);
      await AsyncStorage.setItem("profile", JSON.stringify(newProfile));
      setPreview(null);
      setFile(null);

      Alert.alert("Berhasil", "Profil berhasil diperbarui!");
    } catch (err) {
      console.log("Error update:", err);
      Alert.alert("Gagal update profil");
    }
  };

  //------------------------------------------------------
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("profile");
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

  //------------------------------------------------------
  // 🔵 RENDER UI
  //------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Image
          source={{ uri: preview || user.avatar }}
          style={styles.avatar}
        />

        <TouchableOpacity style={styles.editBtn} onPress={pickImage}>
          <Text style={{ color: "white", fontSize: 18 }}>✎</Text>
        </TouchableOpacity>
      </View>

      {/* Name */}
      <TextInput
        placeholder="Nama"
        value={user.name}
        onChangeText={(val) => setUser({ ...user, name: val })}
        style={styles.input}
      />

      {/* Email */}
      <Text style={{ color: "#555", marginBottom: 5 }}>{user.email}</Text>
      <Text style={{ color: "#777", marginBottom: 25 }}>{user.role}</Text>

      <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
        <Text style={styles.btnText}>Simpan Perubahan</Text>
      </TouchableOpacity>

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
    paddingTop: 100,
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

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
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://10.93.86.50:3001";

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState({
    id: 0,
    name: "N/A",
    email: "",
    role: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [successModal, setSuccessModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const buildAvatarUrl = (avatar?: string | null) => {
    if (!avatar) return "";
    return avatar.startsWith("http") ? avatar : `${API_URL}${avatar}`;
  };

  /* ================= FETCH PROFILE ================= */
const loadProfile = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    router.replace("../auth/login/page");
    return;
  }

  // 🔹 1️⃣ Ambil dari local dulu
  const localProfile = await AsyncStorage.getItem("profile");
  if (localProfile) {
    const p = JSON.parse(localProfile);
    setUser({
      id: p.id,
      name: p.name || "N/A",
      email: p.email,
      role: p.role,
      avatar: buildAvatarUrl(p.avatar),
    });
  }

  // 🔹 2️⃣ Ambil dari API (sinkron)
  try {
    const res = await fetch(`${API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    if (res.ok) {
      const profileData = {
        id: json.data.id,
        name: json.data.name || "N/A",
        email: json.data.email,
        role: json.data.role,
        avatar: json.data.avatar,
      };

      setUser({
        ...profileData,
        avatar: buildAvatarUrl(profileData.avatar),
      });

      // 🔹 Update cache
      await AsyncStorage.setItem(
        "profile",
        JSON.stringify(profileData)
      );
    }
  } catch (e) {
    console.log("FETCH PROFILE ERROR:", e);
  } finally {
    setLoading(false);
  }
};
 

  /* ================= PICK IMAGE ================= */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPreview(asset.uri);
      setFile(asset);
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    if (!user.name.trim() || user.name === "N/A") {
      Alert.alert("Validasi", "Nama tidak boleh kosong");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", user.name);

      if (file) {
        formData.append("avatar", {
          uri: file.uri,
          name: "avatar.jpg",
          type: "image/jpeg",
        } as any);
      }

      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        Alert.alert("Gagal", "Profil gagal disimpan");
        return;
      }

      // ⬇️ AMAN: ambil ulang profile
      await loadProfile();

      setFile(null);
      setPreview(null);
      setSuccessModal(true);
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      Alert.alert("Error", "Terjadi kesalahan server");
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("../auth/login/page");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* AVATAR */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        {preview || user.avatar ? (
          <Image
            source={{ uri: preview || user.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={{ color: "#555" }}>N/A</Text>
          </View>
        )}

        <TouchableOpacity style={styles.editBtn} onPress={pickImage}>
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* INPUT */}
      <TextInput
        style={styles.input}
        value={user.name}
        onChangeText={(val) => setUser({ ...user, name: val })}
      />

      <Text style={styles.textMuted}>{user.email}</Text>
      <Text style={styles.textMuted}>{user.role}</Text>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={updateProfile}
        disabled={saving}
      >
        <Text style={styles.btnText}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => setLogoutModal(true)}
      >
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>

      {/* SUCCESS MODAL */}
      <Modal transparent visible={successModal} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
            <Text style={styles.modalTitle}>
              Profil Berhasil Diperbarui
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setSuccessModal(false)}
            >
              <Text style={{ color: "white" }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LOGOUT CONFIRM */}
      <Modal transparent visible={logoutModal} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Yakin ingin logout?
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleLogout}
            >
              <Text style={{ color: "white" }}>Yakin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#6b7280" }]}
              onPress={() => setLogoutModal(false)}
            >
              <Text style={{ color: "white" }}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: 80,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#93c5fd",
  },
  avatarFallback: {
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    position: "absolute",
    bottom: 0,
    right: 90,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  textMuted: {
    color: "#666",
    marginBottom: 5,
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginTop: 15,
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
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  modalBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
});

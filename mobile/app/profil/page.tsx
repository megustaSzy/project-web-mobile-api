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

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState({
    id: 0,
    name: "",
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

  /* ================= INIT LOAD ================= */
  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("../auth/login/page");
        return;
      }

      // 🔹 tampilkan data lokal dulu (cepat)
      const localProfile = await AsyncStorage.getItem("profile");
      if (localProfile) {
        const p = JSON.parse(localProfile);
        setUser({
          id: p.id,
          name: p.name || "",
          email: p.email,
          role: p.role,
          avatar: buildAvatarUrl(p.avatar),
        });
      }

      setLoading(false);

      // 🔹 sync API background
      fetchProfile(token);
    };

    init();
  }, []);

  /* ================= FETCH PROFILE API ================= */
  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (res.ok) {
        const profileData = {
          id: json.data.id,
          name: json.data.name || "",
          email: json.data.email,
          role: json.data.role,
          avatar: json.data.avatar,
        };

        setUser({
          ...profileData,
          avatar: buildAvatarUrl(profileData.avatar),
        });

        await AsyncStorage.setItem(
          "profile",
          JSON.stringify(profileData)
        );
      }
    } catch (err) {
      console.log("PROFILE FETCH ERROR:", err);
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
    if (!user.name.trim()) {
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

      await fetchProfile(token);

      setFile(null);
      setPreview(null);
      setSuccessModal(true);
    } catch (err) {
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#2563eb" />
        <Text style={{ marginTop: 8, color: "#6b7280" }}>
          Memuat akun...
        </Text>
      </View>
    );
  }

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Akun Saya</Text>
        <Text style={styles.subtitle}>
          Kelola informasi profil Anda
        </Text>

        {/* AVATAR */}
        <View style={styles.avatarWrap}>
          {preview || user.avatar ? (
            <Image
              source={{ uri: preview || user.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={40} color="#9ca3af" />
            </View>
          )}

          <TouchableOpacity style={styles.editBtn} onPress={pickImage}>
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* INPUT */}
        <Text style={styles.label}>Nama Lengkap</Text>
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
      </View>

      {/* SUCCESS MODAL */}
      <Modal transparent visible={successModal} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Ionicons name="checkmark-circle" size={60} color="#22c55e" />
            <Text style={styles.modalTitle}>
              Profil berhasil diperbarui
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

      {/* LOGOUT MODAL */}
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
    backgroundColor: "#f3f4f6",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 20,
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  avatarFallback: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    position: "absolute",
    bottom: 0,
    right: 110,
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 20,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  textMuted: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    marginTop: 14,
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
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
    padding: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
  },
  modalBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    marginTop: 8,
    alignItems: "center",
  },
});

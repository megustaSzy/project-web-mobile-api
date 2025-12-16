import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function NavBarMobile() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userData, setUserData] = useState({
    name: "User",
    avatar: require("../assets/images/faiz.jpg"),
  });

  // =============================
  // LOAD PROFILE (ASYNC + API)
  // =============================
  const loadProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    const localProfile = await AsyncStorage.getItem("profile");

    if (!token) {
      setIsLoggedIn(false);
      setUserData({
        name: "User",
        avatar: require("../assets/images/faiz.jpg"),
      });
      return;
    }

    setIsLoggedIn(true);

    // 1️⃣ Ambil dari local dulu
    if (localProfile) {
      const parsed = JSON.parse(localProfile);
      setUserData({
        name: parsed.name || "User",
        avatar: parsed.avatar
          ? { uri: parsed.avatar }
          : require("../assets/images/faiz.jpg"),
      });
    }

    // 2️⃣ Update dari API
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (res.ok && json.data) {
        const profile = {
          name: json.data.name,
          avatar: json.data.avatar
            ? `${API_URL}${json.data.avatar}`
            : null,
        };

        setUserData({
          name: profile.name,
          avatar: profile.avatar
            ? { uri: profile.avatar }
            : require("../assets/images/faiz.jpg"),
        });

        await AsyncStorage.setItem("profile", JSON.stringify(profile));
      }
    } catch (err) {
      console.log("Navbar profile error:", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // =============================
  // LOGOUT
  // =============================
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("profile");
    setIsLoggedIn(false);
    setUserData({
      name: "User",
      avatar: require("../assets/images/faiz.jpg"),
    });
    setOpen(false);
  };

  return (
    <View style={{ zIndex: 50 }}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* LEFT */}
        <View style={styles.left}>
          <Image
            source={require("../assets/images/logo.png")}
            style={{ width: 40, height: 40 }}
          />

          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>Hi, Selamat Datang</Text>
            <Text style={styles.userName}>{userData.name}</Text>
          </View>
        </View>

        {/* RIGHT */}
        <TouchableOpacity onPress={() => setOpen(!open)}>
          {open ? <CloseIcon size={26} /> : <MenuIcon size={26} />}
        </TouchableOpacity>
      </View>

      {/* MENU */}
      {open && (
        <View style={styles.menu}>
          {isLoggedIn ? (
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  setOpen(false);
                  router.push("../auth/login/page");
                }}
                style={styles.loginBtn}
              >
                <Text style={styles.loginText}>Masuk</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setOpen(false);
                  router.push("../auth/signup/page");
                }}
                style={styles.signupBtn}
              >
                <Text style={styles.signupText}>Daftar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 65,
    paddingHorizontal: 20,
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    zIndex: 50,
    backgroundColor: "rgba(0,0,0,0)",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  welcomeText: { fontSize: 12 },
  userName: { fontSize: 14, fontWeight: "700", marginTop: -2 },
  lang: { fontSize: 14, fontWeight: "700" },
  menu: { marginTop: 65, backgroundColor: "#fff", paddingVertical: 15 },
  menuItem: {
  backgroundColor: "#FF3B30", // merah
  color: "#fff",              // teks putih
  marginHorizontal: 20,
  marginTop: 10,
  padding: 12,
  borderRadius: 8,
  textAlign: "center",        // biar teks di tengah
  fontWeight: "600",
  fontSize: 16,
},
  loginBtnFull: {
    backgroundColor: "#007AFF",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 12,
    borderRadius: 8,
  },
  loginTxtWhite: { color: "white", textAlign: "center", fontWeight: "600" },
  signupBtn: {
    borderWidth: 1,
    borderColor: "#007AFF",
    marginHorizontal: 20,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
  },
  signupTxt: { color: "#007AFF", textAlign: "center", fontWeight: "600" },
  welcomeBox: { marginLeft: 8 },
});

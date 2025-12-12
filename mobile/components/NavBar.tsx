import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react-native";
import { DeviceEventEmitter } from 'react-native';


export default function NavBarMobile() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrolled, setScrolled] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState("id");

  const [userData, setUserData] = useState({
    name: "User",
    avatar: require("../assets/images/faiz.jpg"),
  });

  // HALAMAN DENGAN WARNA NAVBAR
  const blackPages = ["tiket/page", "profil/page"];
  const textColor = blackPages.some((p) => pathname.includes(p)) ? "#000" : "#fff";
  const iconColor = textColor;

  // EFFECT SCROLL
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      setScrolled(value > 10);
    });
    return () => scrollY.removeListener(listener);
  }, []);

  // LOAD BAHASA
  useEffect(() => {
    (async () => {
      const lang = await AsyncStorage.getItem("language");
      if (lang) setLanguage(lang);
    })();
  }, []);

  const handleChangeLanguage = async (lang: string) => {
    setLanguage(lang);
    await AsyncStorage.setItem("language", lang);
  };

  // 🔥 AMBIL PROFIL DARI API + SIMPAN ASYNCSTORAGE
const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    // Jika tidak ada token, langsung set default dan keluar
    if (!token) {
      setIsLoggedIn(false);
      setUserData({ name: 'User', avatar: require('../assets/images/faiz.jpg') });
      return;
    }

    // Ambil data profil dari API
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    // Jika data user kosong, tetap set default
    if (!data.data) {
      setIsLoggedIn(false);
      setUserData({ name: 'User', avatar: require('../assets/images/faiz.jpg') });
      return;
    }

    // Jika data valid, update state user
    setIsLoggedIn(true);
    setUserData({
      name: data.data.name,
      avatar: data.data.avatar
        ? { uri: `${process.env.EXPO_PUBLIC_API_URL}${data.data.avatar}` }
        : require('../assets/images/faiz.jpg'),
    });

    // Simpan ke AsyncStorage
    await AsyncStorage.setItem(
      "profile",
      JSON.stringify({
        name: data.data.name,
        avatar: data.data.avatar ? `${process.env.EXPO_PUBLIC_API_URL}${data.data.avatar}` : null,
      })
    );

  } catch (err) {
    console.log("Error loading profile:", err);
  }
};

  // LOAD DARI API + ASYNCSTORAGE
  const [loadingProfile, setLoadingProfile] = useState(true);

const loadProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const profile = await AsyncStorage.getItem("profile");

    setIsLoggedIn(!!token);

    if (profile) {
      const parsed = JSON.parse(profile);
      setUserData({
        name: parsed.name || "User",
        avatar: parsed.avatar
          ? { uri: parsed.avatar }
          : require("../assets/images/faiz.jpg"),
      });
    }

    await fetchUserProfile(); // pastikan fetch selesai
  } catch (err) {
    console.log("Profile load error:", err);
  } finally {
    setLoadingProfile(false);
  }
};


useEffect(() => {
  const subscription = DeviceEventEmitter.addListener('loginSuccess', async () => {
    setOpen(false);            // tutup menu dulu
    await loadProfile();       // update state userData & isLoggedIn
    setTimeout(() => setOpen(true), 50); // buka kembali menu supaya re-render
  });
  return () => subscription.remove();
}, []);

const [menuReady, setMenuReady] = useState(false);

useEffect(() => {
  const subscription = DeviceEventEmitter.addListener('loginSuccess', async () => {
    setMenuReady(false);        // blok menu
    await loadProfile();        // tunggu state update
    setMenuReady(true);         // render menu baru
  });
  return () => subscription.remove();
}, []);



  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("profile");
    setIsLoggedIn(false);
    setUserData({ name: "User", avatar: require("../assets/images/faiz.jpg") });
  };

  const t = {
    home: language === "id" ? "Beranda" : "Home",
    tour: language === "id" ? "Daftar Wisata" : "Tour List",
    ticket: language === "id" ? "Tiket Saya" : "My Ticket",
    login: language === "id" ? "Masuk" : "Login",
    signup: language === "id" ? "Daftar" : "Sign Up",
    editProfile: language === "id" ? "Edit Profil" : "Edit Profile",
    logout: language === "id" ? "Keluar" : "Logout",
  };

  return (
    <View style={{ zIndex: 50 }}>
      <Animated.View style={[styles.header]}>
        {/* LOGO + WELCOME */}
        <View style={styles.left}>
          <Image
            source={require("../assets/images/logo.png")}
            style={{ width: 40, height: 40 }}
          />

          <View style={styles.welcomeBox}>
            <Text style={[styles.welcomeText, { color: textColor }]}>
              Hi, Selamat Datang
            </Text>
            <Text style={[styles.userName, { color: textColor }]}>
              {userData.name}
            </Text>
          </View>
        </View>

        {/* MENU KANAN */}
        <View style={styles.right}>
          <TouchableOpacity
            onPress={() => handleChangeLanguage(language === "id" ? "en" : "id")}
          >
            <Text style={[styles.lang, { color: textColor }]}>
              {language.toUpperCase()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setOpen(!open)}>
            {open ? (
              <CloseIcon size={26} color={iconColor} />
            ) : (
              <MenuIcon size={26} color={iconColor} />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* MENU MOBILE */}
          {open && menuReady && (
  <View style={styles.menu}>
    {isLoggedIn ? (
      <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>{t.logout}</Text>
      </TouchableOpacity>
    ) : (
      <>
        <TouchableOpacity
          onPress={() => router.push("../auth/login/page")}
          style={styles.loginBtnFull}
        >
          <Text style={styles.loginTxtWhite}>{t.login}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("../auth/signup/page")}
          style={styles.signupBtn}
        >
          <Text style={styles.signupTxt}>{t.signup}</Text>
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

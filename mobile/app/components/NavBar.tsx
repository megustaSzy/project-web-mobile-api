import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react-native';


export default function NavBarMobile() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrolled, setScrolled] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState("id");
  const [userData, setUserData] = useState({
    name: "User",
    avatar: require("../../assets/images/faiz.jpg"),
  });

  // Scroll Shadow Effect
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      setScrolled(value > 10);
    });
    return () => scrollY.removeListener(listener);
  }, [scrollY]);

  // Load Language
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

  // Load Token & Profile
  const loadProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    const profile = await AsyncStorage.getItem("profile");

    setIsLoggedIn(!!token);

    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        setUserData({
          name: parsed.name || "User",
          avatar: parsed.avatar
            ? { uri: parsed.avatar }
            : require("../../assets/images/faiz.jpg"),
        });
      } catch (e) {
        console.log("Profile error");
      }
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const t = {
    home: language === "id" ? "Beranda" : "Home",
    about: language === "id" ? "Tentang Kami" : "About Us",
    tour: language === "id" ? "Daftar Wisata" : "Tour List",
    ticket: language === "id" ? "Tiket Saya" : "My Ticket",
    contact: language === "id" ? "Kontak" : "Contact",
    login: language === "id" ? "Masuk" : "Login",
    signup: language === "id" ? "Daftar" : "Sign Up",
    editProfile: language === "id" ? "Edit Profil" : "Edit Profile",
    logout: language === "id" ? "Keluar" : "Logout",
  };

  return (
    <View style={{ zIndex: 50 }}>
      {/* NAVBAR FIXED */}
      <Animated.View
        style={[
          styles.header,
          scrolled ? styles.header : {},
        ]}
      >
        {/* Logo */}
        <View style={styles.left}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 40, height: 40 }}
          />
        </View>

        {/* Right Menu */}
        <View style={styles.right}>
          {/* Language */}
          <TouchableOpacity
            onPress={() =>
              handleChangeLanguage(language === "id" ? "en" : "id")
            }
          >
            <Text style={styles.lang}>{language.toUpperCase()}</Text>
          </TouchableOpacity>

          

          {/* Burger */}
          <TouchableOpacity onPress={() => setOpen(!open)}>
            {open ? <CloseIcon size={26} color="#000" /> : <MenuIcon size={26} color="#000" />}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* MENU MOBILE */}
      {open && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.menuItem}>{t.home}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/about")}>
            <Text style={styles.menuItem}>{t.about}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/tourlist")}>
            <Text style={styles.menuItem}>{t.tour}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/tiket")}>
            <Text style={styles.menuItem}>{t.ticket}</Text>
          </TouchableOpacity>

          {/* Auth */}
          {isLoggedIn ? (
            <>
              <TouchableOpacity onPress={() => router.push("/profile")}>
                <Text style={styles.menuItem}>{t.editProfile}</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutBtn}
              >
                <Text style={styles.logoutTxt}>{t.logout}</Text>
              </TouchableOpacity> */}
            </>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    zIndex: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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

  lang: {
    fontSize: 14,
    fontWeight: "700",
    color: "#007AFF",
  },

  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },

  loginBtn: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },

  menu: {
    marginTop: 65,
    backgroundColor: "#fff",
    paddingVertical: 15,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  logoutBtn: {
    backgroundColor: "#ff4444",
    padding: 12,
    margin: 20,
    borderRadius: 8,
  },

  logoutTxt: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },

  loginBtnFull: {
    backgroundColor: "#007AFF",
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 8,
  },

  loginTxtWhite: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },

  signupBtn: {
    borderWidth: 1,
    borderColor: "#007AFF",
    marginHorizontal: 20,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
  },

  signupTxt: {
    color: "#007AFF",
    textAlign: "center",
    fontWeight: "600",
  },
});

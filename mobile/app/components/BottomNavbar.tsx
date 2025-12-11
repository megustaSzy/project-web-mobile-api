import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets(); // ambil safe area

  const menus = [
    { name: "Beranda", icon: "home-outline", activeIcon: "home", path: "/components/Landingpage" },
    { name: "Destinasi", icon: "map-outline", activeIcon: "map", path: "/tourlist/page" },
    { name: "Tiket Saya", icon: "ticket-outline", activeIcon: "ticket", path: "/tiket/page" },
    { name: "Profil", icon: "person-outline", activeIcon: "person", path: "/profil/page" },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 10 }]}>
      {menus.map((item, index) => {
        const active = pathname.startsWith(item.path);

        return (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.path)}
          >
            <Ionicons
              name={active ? item.activeIcon : item.icon}
              size={26}
              color={active ? "#007bff" : "#9E9E9E"}
            />
            <Text style={[styles.menuText, { color: active ? "#007bff" : "#9E9E9E" }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 62,
    alignItems: "center",
    zIndex: 999,
    paddingTop : 10,
  },
  menuItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 12,
    marginTop: 3,
  },
});

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SearchCard from "./SearchCard";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

export default function Hero() {
  return (
    <View style={styles.container}>
      {/* Blue Gradient Background */}
      <LinearGradient
        colors={["#1A73E8", "#4A90E2"]}
        style={styles.background}
      />

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <SearchCard />
      </View>

      {/* Menu Card */}
      <View style={styles.menuCard}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {menuItems.map((item, idx) => (
            <View key={idx} style={styles.menuItem}>
              <View style={styles.menuIcon}>
                {/* <Ionicons name={item.icon} size={24} color="#fff" /> */}
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const menuItems = [
  { title: "Tiket Pesawat", icon: "airplane" },
  { title: "Hotel", icon: "bed" },
  { title: "Xperience", icon: "ticket" },
  { title: "Tiket Kereta", icon: "train" },
  { title: "Tiket Bus", icon: "bus" },
  { title: "Paket Wisata", icon: "map" },
];

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: height * 0.40,
    backgroundColor: "#fff",
  },
  background: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  searchWrapper: {
    position: "absolute",
    top: Platform.OS === "android" ? 45 : 60,
    left: 15,
    right: 15,
    zIndex: 20,
  },

  menuCard: {
    position: "absolute",
    bottom: -40,
    left: 15,
    right: 15,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  menuItem: {
    alignItems: "center",
    marginRight: 25,
  },
  menuIcon: {
    width: 55,
    height: 55,
    backgroundColor: "#1A73E8",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  menuText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    width: 70,
  },
});

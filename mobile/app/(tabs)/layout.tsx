// app/_layout.js
import React from "react";
import { View, SafeAreaView, StatusBar, StyleSheet, Platform } from "react-native";
import { Slot } from "expo-router";
import NavBar from "../components/NavBar";          // Top navbar
import BottomNavbar from "../components/BottomNavbar"; // Bottom navbar

export default function TabsLayout() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Top Navbar */}
      {/* <NavBar /> */}

      {/* Konten halaman */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Bottom Navbar */}
      {/* <BottomNavbar /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Pastikan konten tidak tertutup BottomNavbar
  },
});

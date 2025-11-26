import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";

export default function HeroTourSection() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/hero1.jpg")}
        style={styles.image}
        resizeMode="cover"
      >
        {/* Overlay */}
        <View style={styles.overlay} />

        {/* Text Content */}
        <View style={styles.textWrap}>
          <Text style={styles.title}>About Us</Text>
          <Text style={styles.desc}>
            Temukan destinasi terbaik, atur perjalanan impianmu, dan pesan tiket
            dengan mudah dalam satu aplikasi lengkap untuk semua kebutuhan liburan
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 430,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  textWrap: {
    zIndex: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    textAlign: "center",
    color: "#fff",
    opacity: 0.9,
    maxWidth: 330,
  },
});

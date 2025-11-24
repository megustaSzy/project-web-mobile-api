import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";

export default function HeroSection() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/boute.jpg")} // sesuaikan path gambar
        style={styles.background}
        imageStyle={styles.image}
      >
        <View style={styles.overlay} />

        <View style={styles.textWrapper}>
          <Text style={styles.title}>About Us</Text>
          <Text style={styles.description}>
            Temukan destinasi terbaik, atur perjalanan impianmu, dan pesan tiket
            dengan mudah dalam satu aplikasi lengkap untuk semua kebutuhan liburan.
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 420,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  textWrapper: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
    maxWidth: 300,
  },
});

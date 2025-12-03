// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import SearchCard from "./SearchCard";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

export default function Hero() {
  return (
    <View style={styles.container}>
      
      {/* Background Traveloka Style */}
      <LinearGradient
        colors={["#3FA9F5", "#1A73E8"]}
        style={styles.background}
      />

      {/* Content */}
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/best.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>LamiGo Jelajah Alam Lampung</Text>

        <Text style={styles.subtitle}>
          Temukan destinasi terbaik, atur perjalanan impianmu, dan pesan tiket dengan mudah dalam satu aplikasi.
        </Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchWrapper}>
        <SearchCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.75,
    width: "100%",
    justifyContent: "flex-end",
  },
  background: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  content: {
    zIndex: 10,
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: Platform.OS === "android" ? 70 : 90,
  },
  logo: {
    width: 85,
    height: 85,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 330,
    marginBottom: 12,
  },
  searchWrapper: {
    position: "absolute",
    bottom: Platform.OS === "android" ? -20 : -30,
    left: "5%",
    right: "5%",
    zIndex: 20,
  },
});
